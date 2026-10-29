import { parsePaisa, paisaInput } from '../../shared/money/paisa.ts';
import { calendarDate, localDate } from '../tenancies/tenancyValidation.ts';
import { safeTotal } from './billCalculations.ts';
import type { BillLine } from './additionalCharges.ts';

export type PaymentMethod = 'cash' | 'bank' | 'wallet';
export type PaymentInput = {
  amount: string;
  receivedOn: string;
  method: PaymentMethod | '';
  reference: string;
  notes: string;
};
export type Allocation = { lineId: number; amountPaisa: number };
export type DueLine = {
  lineId: number;
  billId: number;
  month: string;
  kind: BillLine['kind'];
  name: string;
  outstandingPaisa: number;
};
export type AllocationInput = { lineId: number; amount: string };
export type PaymentProblem =
  | 'amount'
  | 'date'
  | 'method'
  | 'allocation'
  | 'excess'
  | 'stale'
  | 'missing'
  | 'operation'
  | 'reason'
  | 'save';
export class PaymentError extends Error {
  readonly code: PaymentProblem;
  readonly lineId?: number;
  readonly paymentId?: number;
  constructor(code: PaymentProblem, lineId?: number, paymentId?: number) {
    super(code);
    this.code = code;
    this.lineId = lineId;
    this.paymentId = paymentId;
  }
}
export function paymentValues(input: PaymentInput, today = localDate()) {
  const amountPaisa = parsePaisa(input.amount);
  if (amountPaisa === undefined || amountPaisa <= 0)
    throw new PaymentError('amount');
  if (!calendarDate(input.receivedOn) || input.receivedOn > today)
    throw new PaymentError('date');
  if (
    input.method !== 'cash' &&
    input.method !== 'bank' &&
    input.method !== 'wallet'
  )
    throw new PaymentError('method');
  return {
    amountPaisa,
    receivedOn: input.receivedOn,
    method: input.method,
    reference: input.reference.trim(),
    notes: input.notes.trim(),
  };
}
export function allocationValues(input: AllocationInput[]): Allocation[] {
  return input.flatMap((entry) => {
    const amount = entry.amount.trim() ? parsePaisa(entry.amount) : 0;
    if (amount === undefined)
      throw new PaymentError('allocation', entry.lineId);
    return amount ? [{ lineId: entry.lineId, amountPaisa: amount }] : [];
  });
}
export function validateAllocations(
  amount: number,
  allocations: Allocation[],
  due: DueLine[],
) {
  if (amount > safeTotal(due.map((line) => line.outstandingPaisa)))
    throw new PaymentError('excess');
  const seen = new Set<number>();
  for (const allocation of allocations) {
    const line = due.find((entry) => entry.lineId === allocation.lineId);
    if (
      !line ||
      seen.has(allocation.lineId) ||
      !Number.isSafeInteger(allocation.amountPaisa) ||
      allocation.amountPaisa <= 0 ||
      allocation.amountPaisa > line.outstandingPaisa
    )
      throw new PaymentError('stale', allocation.lineId);
    seen.add(allocation.lineId);
  }
  if (safeTotal(allocations.map((entry) => entry.amountPaisa)) !== amount)
    throw new PaymentError('allocation');
}
export function suggestAllocations(
  due: DueLine[],
  amount: number,
  preferredBillId?: number,
): AllocationInput[] {
  const ordered = [...due].sort((a, b) => {
    const priority =
      Number(b.billId === preferredBillId) -
      Number(a.billId === preferredBillId);
    return priority || a.month.localeCompare(b.month) || a.billId - b.billId;
  });
  let left = amount;
  const amounts = new Map<number, number>();
  for (const line of ordered) {
    const allocated = Math.min(left, line.outstandingPaisa);
    amounts.set(line.lineId, allocated);
    left -= allocated;
  }
  return due.map((line) => ({
    lineId: line.lineId,
    amount: paisaInput(amounts.get(line.lineId) ?? 0),
  }));
}
