import type { SQLiteDatabase } from 'expo-sqlite';
import {
  activeAllocations,
  hasActiveBillAllocations,
} from './paymentBalances.ts';
import { paisaInput } from '../../shared/money/paisa.ts';
import {
  applicableCharges,
  chargeSignature,
  listChargeVersions,
} from '../tenancies/chargeSettings.ts';
import {
  prepareExtras,
  savedExtras,
  normalizedChargeName,
  type BillLine,
  type ExtraInput,
} from './additionalCharges.ts';
import {
  BillError,
  proposeBill,
  reviewedAmount,
  safeTotal,
  sourceSignature,
  type BillProposal,
  type BillingSource,
} from './billCalculations.ts';

export type BillingTenancy = BillingSource & {
  id: number;
  tenantId: number;
  tenantName: string;
  unitId: number;
  unitName: string;
  floorName: string;
  propertyId: number;
  propertyName: string;
  endedOn?: string;
};
export type Bill = BillProposal & {
  id: number;
  tenancyId: number;
  status: 'draft' | 'finalized' | 'void';
  amountPaisa: number;
  paidPaisa: number;
  outstandingPaisa: number;
  rentAmountPaisa: number;
  lines: BillLine[];
  chargeSignature: string;
  overrideReason: string;
  voidReason: string;
  createdAt: string;
  updatedAt: string;
  finalizedAt?: string;
  voidedAt?: string;
  tenantId: number;
  tenantName: string;
  unitId: number;
  unitName: string;
  floorName: string;
  propertyId: number;
  propertyName: string;
};
export async function getBillingTenancy(
  db: SQLiteDatabase,
  id: number,
): Promise<BillingTenancy | undefined> {
  const row = await db.getFirstAsync<
    Omit<BillingTenancy, 'endedOn'> & { endedOn: string | null }
  >(
    `SELECT t.id,
    t.tenant_id AS tenantId, p.name AS tenantName, t.unit_id AS unitId, u.name AS unitName, f.name AS floorName,
    h.id AS propertyId, h.name AS propertyName, t.start_date AS startDate, t.rent_paisa AS rentPaisa,
    t.due_day AS dueDay, t.notice_months AS noticeMonths, t.agreed_advance_paisa AS agreedAdvancePaisa, t.ended_on AS endedOn
    FROM tenancies t JOIN tenants p ON p.id=t.tenant_id JOIN units u ON u.id=t.unit_id
    JOIN floors f ON f.id=u.floor_id JOIN properties h ON h.id=f.property_id WHERE t.id=?`,
    id,
  );
  return row ? { ...row, endedOn: row.endedOn ?? undefined } : undefined;
}
const billSelect = `SELECT b.id, b.tenancy_id AS tenancyId, b.billing_month AS month, b.status,
  b.covered_from AS coveredFrom, b.covered_through AS coveredThrough, b.due_date AS dueDate,
  b.source_start_date AS sourceStartDate, b.source_due_day AS sourceDueDay, b.source_signature AS sourceSignature,
  l.reference_amount_paisa AS referenceRentPaisa, l.proposed_paisa AS proposedPaisa, l.amount_paisa AS rentAmountPaisa, b.charge_signature AS chargeSignature,
  l.override_reason AS overrideReason, b.void_reason AS voidReason, b.created_at AS createdAt, b.updated_at AS updatedAt,
  b.finalized_at AS finalizedAt, b.voided_at AS voidedAt, t.tenant_id AS tenantId, p.name AS tenantName,
  t.unit_id AS unitId, u.name AS unitName, f.name AS floorName, h.id AS propertyId, h.name AS propertyName
  FROM bills b JOIN bill_lines l ON l.bill_id=b.id AND l.kind='rent'
  JOIN tenancies t ON t.id=b.tenancy_id JOIN tenants p ON p.id=t.tenant_id
  JOIN units u ON u.id=t.unit_id JOIN floors f ON f.id=u.floor_id JOIN properties h ON h.id=f.property_id`;
type BillRow = Omit<
  Bill,
  | 'finalizedAt'
  | 'voidedAt'
  | 'lines'
  | 'amountPaisa'
  | 'paidPaisa'
  | 'outstandingPaisa'
> & {
  finalizedAt: string | null;
  voidedAt: string | null;
};
function record(
  row: BillRow,
  lines: BillLine[],
  allocations: Map<number, number>,
): Bill {
  const amountPaisa = safeTotal(lines.map((line) => line.amountPaisa));
  const paidPaisa = safeTotal(
    lines.map((line) => allocations.get(line.id) ?? 0),
  );
  if (
    paidPaisa > amountPaisa ||
    lines.some((line) => (allocations.get(line.id) ?? 0) > line.amountPaisa)
  )
    throw new BillError('range');
  return {
    ...row,
    lines: lines.map((line) => ({
      ...line,
      paidPaisa: allocations.get(line.id) ?? 0,
    })),
    amountPaisa,
    paidPaisa,
    outstandingPaisa: row.status === 'finalized' ? amountPaisa - paidPaisa : 0,
    finalizedAt: row.finalizedAt ?? undefined,
    voidedAt: row.voidedAt ?? undefined,
  };
}
export async function getBill(
  db: SQLiteDatabase,
  id: number,
): Promise<Bill | undefined> {
  const row = await db.getFirstAsync<BillRow>(`${billSelect} WHERE b.id=?`, id);
  if (!row) return undefined;
  return record(
    row,
    await billLines(db, id),
    await activeAllocations(db, { billId: id }),
  );
}
async function billLines(
  db: SQLiteDatabase,
  billId?: number,
  tenancyId?: number,
) {
  return db.getAllAsync<BillLine & { billId: number }>(
    `SELECT l.id, l.bill_id AS billId, l.kind, l.display_name AS name, l.position, l.source_mode AS sourceMode,
    l.reference_amount_paisa AS referencePaisa, l.proposed_paisa AS proposedPaisa, l.amount_paisa AS amountPaisa, l.override_reason AS overrideReason
    FROM bill_lines l JOIN bills b ON b.id=l.bill_id WHERE (? IS NULL OR b.id=?) AND (? IS NULL OR b.tenancy_id=?) ORDER BY l.position,l.id`,
    billId ?? null,
    billId ?? null,
    tenancyId ?? null,
    tenancyId ?? null,
  );
}
export async function listBills(
  db: SQLiteDatabase,
  tenancyId?: number,
): Promise<Bill[]> {
  const rows = await db.getAllAsync<BillRow>(
    `${billSelect} WHERE (? IS NULL OR b.tenancy_id=?) ORDER BY b.billing_month DESC, b.id DESC`,
    tenancyId ?? null,
    tenancyId ?? null,
  );
  const lines = await billLines(db, undefined, tenancyId);
  const grouped = new Map<number, BillLine[]>();
  for (const line of lines) {
    const group = grouped.get(line.billId) ?? [];
    group.push(line);
    grouped.set(line.billId, group);
  }
  const allocations = await activeAllocations(db, { tenancyId });
  return rows.map((row) => record(row, grouped.get(row.id) ?? [], allocations));
}
export function outstandingPaisa(bills: Bill[]) {
  // Recorded allocations reduce the shared balance; drafts/voids never create dues.
  return safeTotal(
    bills
      .filter((bill) => bill.status === 'finalized')
      .map((bill) => bill.outstandingPaisa),
  );
}
export async function tenancyBillSummary(
  db: SQLiteDatabase,
  tenancyId: number,
) {
  const bills = await listBills(db, tenancyId);
  return {
    outstandingPaisa: outstandingPaisa(bills),
    finalizedCount: bills.filter((bill) => bill.status === 'finalized').length,
  };
}
function writeError(error: unknown): never {
  if (
    error instanceof Error &&
    error.message.includes(
      'UNIQUE constraint failed: bills.tenancy_id, bills.billing_month',
    )
  )
    throw new BillError('duplicate');
  if (
    error instanceof Error &&
    error.message.includes('FOREIGN KEY constraint failed')
  )
    throw new BillError('missing');
  throw error;
}
export async function saveDraft(
  db: SQLiteDatabase,
  input: {
    tenancyId: number;
    month: string;
    amount: string;
    reason: string;
    expectedSource: string;
    expectedCharges?: string;
    extras?: ExtraInput[];
    billId?: number;
  },
): Promise<number> {
  let id: number | undefined;
  try {
    await db.withExclusiveTransactionAsync(async (tx) => {
      const tenancy = await getBillingTenancy(tx, input.tenancyId);
      if (!tenancy) throw new BillError('missing');
      if (tenancy.endedOn) throw new BillError('closed');
      if (sourceSignature(tenancy) !== input.expectedSource)
        throw new BillError('termsChanged');
      const proposal = proposeBill(tenancy, input.month),
        amount = reviewedAmount(
          input.amount,
          input.reason,
          proposal.proposedPaisa,
        );
      const chargeVersion = applicableCharges(
        await listChargeVersions(tx, input.tenancyId),
        input.month,
      );
      const signature = chargeSignature(chargeVersion);
      if (signature !== (input.expectedCharges ?? ''))
        throw new BillError('termsChanged');
      const extraLines = prepareExtras(input.extras ?? [], chargeVersion);
      safeTotal([amount, ...extraLines.map((line) => line.amountPaisa)]);
      const reason =
          amount === proposal.proposedPaisa ? '' : input.reason.trim(),
        now = new Date().toISOString();
      if (input.billId !== undefined) {
        const current = await getBill(tx, input.billId);
        if (!current || current.tenancyId !== input.tenancyId)
          throw new BillError('missing');
        if (current.status !== 'draft') throw new BillError('readonly');
        await tx.runAsync(
          `UPDATE bills SET billing_month=?, covered_from=?, covered_through=?, due_date=?,
          source_start_date=?, source_due_day=?, source_signature=?, charge_signature=?, updated_at=? WHERE id=? AND status='draft'`,
          proposal.month,
          proposal.coveredFrom,
          proposal.coveredThrough,
          proposal.dueDate,
          proposal.sourceStartDate,
          proposal.sourceDueDay,
          proposal.sourceSignature,
          signature,
          now,
          current.id,
        );
        await tx.runAsync(
          `UPDATE bill_lines SET reference_amount_paisa=?, proposed_paisa=?, amount_paisa=?, override_reason=? WHERE bill_id=? AND kind='rent'`,
          proposal.referenceRentPaisa,
          proposal.proposedPaisa,
          amount,
          reason,
          current.id,
        );
        id = current.id;
      } else {
        const inserted = await tx.runAsync(
          `INSERT INTO bills (tenancy_id,billing_month,status,covered_from,covered_through,due_date,
          source_start_date,source_due_day,source_signature,charge_signature,calculation_rule,created_at,updated_at) VALUES (?,?,'draft',?,?,?,?,?,?,?,'calendar-days-whole-taka-v1',?,?)`,
          input.tenancyId,
          proposal.month,
          proposal.coveredFrom,
          proposal.coveredThrough,
          proposal.dueDate,
          proposal.sourceStartDate,
          proposal.sourceDueDay,
          proposal.sourceSignature,
          signature,
          now,
          now,
        );
        id = inserted.lastInsertRowId;
        await tx.runAsync(
          `INSERT INTO bill_lines (bill_id,kind,reference_amount_paisa,proposed_paisa,amount_paisa,override_reason) VALUES (?,'rent',?,?,?,?)`,
          id,
          proposal.referenceRentPaisa,
          proposal.proposedPaisa,
          amount,
          reason,
        );
      }
      // Replacing draft-only extras is atomic with the header and rent update.
      await tx.runAsync(
        "DELETE FROM bill_lines WHERE bill_id=? AND kind<>'rent'",
        id,
      );
      for (const line of extraLines) {
        await tx.runAsync(
          `INSERT INTO bill_lines (bill_id,kind,reference_amount_paisa,proposed_paisa,amount_paisa,override_reason,display_name,name_key,position,source_mode) VALUES (?,?,?,?,?,?,?,?,?,?)`,
          id,
          line.kind,
          line.referencePaisa,
          line.proposedPaisa,
          line.amountPaisa,
          line.overrideReason,
          line.name,
          line.kind === 'other' ? normalizedChargeName(line.name) : '',
          line.position,
          line.sourceMode,
        );
      }
    });
  } catch (error) {
    writeError(error);
  }
  if (id === undefined) throw new BillError('save');
  return id;
}
export async function finalizeBill(db: SQLiteDatabase, id: number) {
  await db.withExclusiveTransactionAsync(async (tx) => {
    const bill = await getBill(tx, id);
    if (!bill) throw new BillError('missing');
    if (bill.status === 'finalized') return;
    if (bill.status !== 'draft') throw new BillError('readonly');
    const tenancy = await getBillingTenancy(tx, bill.tenancyId);
    if (!tenancy) throw new BillError('missing');
    if (tenancy.endedOn) throw new BillError('closed');
    if (sourceSignature(tenancy) !== bill.sourceSignature)
      throw new BillError('termsChanged');
    const version = applicableCharges(
      await listChargeVersions(tx, bill.tenancyId),
      bill.month,
    );
    if (chargeSignature(version) !== bill.chargeSignature)
      throw new BillError('termsChanged');
    const refreshed = prepareExtras(savedExtras(bill.lines), version);
    const stored = bill.lines.filter((line) => line.kind !== 'rent');
    if (
      refreshed.some(
        (line, index) =>
          line.proposedPaisa !== stored[index]?.proposedPaisa ||
          line.sourceMode !== stored[index]?.sourceMode,
      )
    )
      throw new BillError('termsChanged');
    safeTotal(bill.lines.map((line) => line.amountPaisa));
    const proposal = proposeBill(tenancy, bill.month);
    if (
      proposal.proposedPaisa !== bill.proposedPaisa ||
      proposal.dueDate !== bill.dueDate ||
      proposal.coveredFrom !== bill.coveredFrom ||
      proposal.coveredThrough !== bill.coveredThrough
    )
      throw new BillError('termsChanged');
    reviewedAmount(
      paisaInput(bill.rentAmountPaisa),
      bill.overrideReason,
      bill.proposedPaisa,
    );
    const now = new Date().toISOString();
    await tx.runAsync(
      "UPDATE bills SET status='finalized', finalized_at=?, updated_at=? WHERE id=? AND status='draft'",
      now,
      now,
      id,
    );
  });
}
export async function voidBill(db: SQLiteDatabase, id: number, reason: string) {
  if (!reason.trim()) throw new BillError('reason');
  await db.withExclusiveTransactionAsync(async (tx) => {
    const bill = await getBill(tx, id);
    if (!bill) throw new BillError('missing');
    if (bill.status === 'void') return;
    if (bill.status !== 'finalized') throw new BillError('readonly');
    if (await hasActiveBillAllocations(tx, id))
      throw new BillError('allocated');
    const now = new Date().toISOString();
    await tx.runAsync(
      "UPDATE bills SET status='void', void_reason=?, voided_at=?, updated_at=? WHERE id=? AND status='finalized'",
      reason.trim(),
      now,
      now,
      id,
    );
  });
}
export async function discardDraft(db: SQLiteDatabase, id: number) {
  const result = await db.runAsync(
    "DELETE FROM bills WHERE id=? AND status='draft'",
    id,
  );
  if (result.changes !== 1) throw new BillError('readonly');
}
