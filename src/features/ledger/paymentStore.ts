import type { SQLiteDatabase } from 'expo-sqlite';
import { getBillingTenancy, listBills } from './billStore.ts';
import { safeTotal } from './billCalculations.ts';
import {
  paymentValues,
  validateAllocations,
  PaymentError,
  type PaymentInput,
  type Allocation,
  type DueLine,
  type PaymentMethod,
} from './paymentValidation.ts';

export type Payment = {
  id: number;
  tenancyId: number;
  amountPaisa: number;
  remainingPaisa: number;
  receivedOn: string;
  method: PaymentMethod;
  reference: string;
  notes: string;
  tenantName: string;
  propertyName: string;
  floorName: string;
  unitName: string;
  status: 'recorded' | 'reversed';
  recordedAt: string;
  reversedAt?: string;
  reversalReason: string;
};
export type ReceiptAllocation = Allocation & {
  month: string;
  kind: DueLine['kind'];
  name: string;
};
const paymentSelect = `SELECT id, tenancy_id AS tenancyId, amount_paisa AS amountPaisa, remaining_paisa AS remainingPaisa, received_on AS receivedOn,
  method, reference, notes, tenant_name AS tenantName, property_name AS propertyName, floor_name AS floorName, unit_name AS unitName,
  status, recorded_at AS recordedAt, reversed_at AS reversedAt, reversal_reason AS reversalReason FROM payments`;
type PaymentRow = Omit<Payment, 'reversedAt'> & { reversedAt: string | null };
function paymentRecord(row: PaymentRow): Payment {
  return { ...row, reversedAt: row.reversedAt ?? undefined };
}
export async function newPaymentOperation(db: SQLiteDatabase): Promise<string> {
  const row = await db.getFirstAsync<{ token: string }>(
    'SELECT lower(hex(randomblob(16))) AS token',
  );
  if (!row) throw new PaymentError('save');
  return row.token;
}
export async function getPayment(db: SQLiteDatabase, id: number) {
  const row = await db.getFirstAsync<PaymentRow>(
    `${paymentSelect} WHERE id=?`,
    id,
  );
  return row ? paymentRecord(row) : undefined;
}
export async function listPayments(
  db: SQLiteDatabase,
  scope: { tenancyId?: number; billId?: number } = {},
): Promise<Payment[]> {
  const rows = await db.getAllAsync<PaymentRow>(
    `${paymentSelect} WHERE (? IS NULL OR tenancy_id=?) AND
    (? IS NULL OR id IN (SELECT a.payment_id FROM payment_allocations a JOIN bill_lines l ON l.id=a.bill_line_id WHERE l.bill_id=?)) ORDER BY received_on DESC,id DESC`,
    scope.tenancyId ?? null,
    scope.tenancyId ?? null,
    scope.billId ?? null,
    scope.billId ?? null,
  );
  return rows.map(paymentRecord);
}
export async function receiptAllocations(
  db: SQLiteDatabase,
  paymentId: number,
): Promise<ReceiptAllocation[]> {
  return db.getAllAsync<ReceiptAllocation>(
    `SELECT bill_line_id AS lineId, amount_paisa AS amountPaisa, billing_month AS month, charge_kind AS kind, charge_name AS name FROM payment_allocations WHERE payment_id=? ORDER BY id`,
    paymentId,
  );
}
export async function listDueLines(
  db: SQLiteDatabase,
  tenancyId: number,
): Promise<DueLine[]> {
  const bills = await listBills(db, tenancyId);
  return bills
    .filter((bill) => bill.status === 'finalized')
    .sort((a, b) => a.month.localeCompare(b.month) || a.id - b.id)
    .flatMap((bill) =>
      bill.lines
        .filter((line) => line.amountPaisa > (line.paidPaisa ?? 0))
        .map((line) => ({
          lineId: line.id,
          billId: bill.id,
          month: bill.month,
          kind: line.kind,
          name: line.name,
          outstandingPaisa: line.amountPaisa - (line.paidPaisa ?? 0),
        })),
    );
}
export async function recordPayment(
  db: SQLiteDatabase,
  tenancyId: number,
  operationId: string,
  input: PaymentInput,
  allocations: Allocation[],
): Promise<number> {
  const values = paymentValues(input);
  if (!/^[a-f0-9]{32}$/.test(operationId)) throw new PaymentError('operation');
  const ordered = [...allocations].sort((a, b) => a.lineId - b.lineId);
  const signature = JSON.stringify([
    tenancyId,
    values,
    ordered.map((entry) => [entry.lineId, entry.amountPaisa]),
  ]);
  let id: number | undefined;
  await db.withExclusiveTransactionAsync(async (tx) => {
    const prior = await tx.getFirstAsync<{ id: number; signature: string }>(
      'SELECT id,request_signature AS signature FROM payments WHERE operation_id=?',
      operationId,
    );
    if (prior) {
      if (prior.signature !== signature)
        throw new PaymentError('operation', undefined, prior.id);
      id = prior.id;
      return;
    }
    const tenancy = await getBillingTenancy(tx, tenancyId);
    if (!tenancy) throw new PaymentError('missing');
    const due = await listDueLines(tx, tenancyId);
    validateAllocations(values.amountPaisa, allocations, due);
    const result = await tx.runAsync(
      `INSERT INTO payments (tenancy_id,operation_id,request_signature,amount_paisa,remaining_paisa,received_on,method,reference,notes,
      tenant_name,property_name,floor_name,unit_name,status,recorded_at) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,'recorded',?)`,
      tenancyId,
      operationId,
      signature,
      values.amountPaisa,
      safeTotal(due.map((line) => line.outstandingPaisa)) - values.amountPaisa,
      values.receivedOn,
      values.method,
      values.reference,
      values.notes,
      tenancy.tenantName,
      tenancy.propertyName,
      tenancy.floorName,
      tenancy.unitName,
      new Date().toISOString(),
    );
    id = result.lastInsertRowId;
    for (const allocation of allocations) {
      const line = due.find((entry) => entry.lineId === allocation.lineId);
      if (!line) throw new PaymentError('stale', allocation.lineId);
      await tx.runAsync(
        `INSERT INTO payment_allocations (payment_id,bill_line_id,amount_paisa,billing_month,charge_kind,charge_name) VALUES (?,?,?,?,?,?)`,
        id,
        line.lineId,
        allocation.amountPaisa,
        line.month,
        line.kind,
        line.name,
      );
    }
  });
  if (id === undefined) throw new PaymentError('save');
  return id;
}
export async function reversePayment(
  db: SQLiteDatabase,
  id: number,
  reason: string,
) {
  if (!reason.trim()) throw new PaymentError('reason');
  await db.withExclusiveTransactionAsync(async (tx) => {
    const payment = await getPayment(tx, id);
    if (!payment) throw new PaymentError('missing');
    if (payment.status === 'reversed') return;
    await tx.runAsync(
      "UPDATE payments SET status='reversed', reversed_at=?, reversal_reason=? WHERE id=? AND status='recorded'",
      new Date().toISOString(),
      reason.trim(),
      id,
    );
  });
}
