import { parsePaisa } from '../../shared/money/paisa.ts';
import { calendarDate, localDate } from '../tenancies/tenancyValidation.ts';

export type BillingSource = {
  startDate: string;
  rentPaisa: number;
  dueDay: number;
  noticeMonths: number;
  agreedAdvancePaisa: number;
};
export type BillProposal = {
  month: string;
  coveredFrom: string;
  coveredThrough: string;
  dueDate: string;
  sourceStartDate: string;
  sourceDueDay: number;
  sourceSignature: string;
  referenceRentPaisa: number;
  proposedPaisa: number;
};
export type BillProblem =
  | 'month'
  | 'amount'
  | 'reason'
  | 'duplicate'
  | 'missing'
  | 'readonly'
  | 'termsChanged'
  | 'closed'
  | 'range'
  | 'allocated'
  | 'save';
export class BillError extends Error {
  readonly code: BillProblem;
  constructor(code: BillProblem) {
    super(code);
    this.code = code;
  }
}
export function sourceSignature(source: BillingSource) {
  return JSON.stringify([
    source.startDate,
    source.rentPaisa,
    source.dueDay,
    source.noticeMonths,
    source.agreedAdvancePaisa,
  ]);
}
export function monthDays(year: number, month: number) {
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  return [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][
    month - 1
  ];
}
export function proposeBill(
  source: BillingSource,
  month: string,
  today = localDate(),
): BillProposal {
  if (
    !calendarDate(source.startDate) ||
    source.startDate > today ||
    !/^\d{4}-\d{2}$/.test(month) ||
    !calendarDate(`${month}-01`) ||
    month < source.startDate.slice(0, 7) ||
    month > today.slice(0, 7)
  )
    throw new BillError('month');
  if (
    !Number.isSafeInteger(source.rentPaisa) ||
    source.rentPaisa <= 0 ||
    !Number.isInteger(source.dueDay) ||
    source.dueDay < 1 ||
    source.dueDay > 31
  )
    throw new BillError('range');
  const [year, index] = month.split('-').map(Number),
    days = monthDays(year, index);
  const first =
    month === source.startDate.slice(0, 7)
      ? Number(source.startDate.slice(8))
      : 1;
  let amount = BigInt(source.rentPaisa);
  if (first > 1) {
    const numerator = amount * BigInt(days - first + 1),
      denominator = BigInt(days) * 100n;
    // Round a nonnegative rational to whole taka; half a taka rounds up.
    amount = ((numerator * 2n + denominator) / (denominator * 2n)) * 100n;
  }
  if (amount > BigInt(Number.MAX_SAFE_INTEGER)) throw new BillError('range');
  return {
    month,
    coveredFrom: `${month}-${String(first).padStart(2, '0')}`,
    coveredThrough: `${month}-${days}`,
    dueDate: `${month}-${String(Math.min(source.dueDay, days)).padStart(2, '0')}`,
    sourceStartDate: source.startDate,
    sourceDueDay: source.dueDay,
    sourceSignature: sourceSignature(source),
    referenceRentPaisa: source.rentPaisa,
    proposedPaisa: Number(amount),
  };
}
export function reviewedAmount(
  value: string,
  reason: string,
  proposedPaisa: number,
) {
  const amount = parsePaisa(value);
  if (amount === undefined) throw new BillError('amount');
  if (amount !== proposedPaisa && !reason.trim()) throw new BillError('reason');
  return amount;
}
export function safeTotal(amounts: number[]) {
  let total = 0n;
  for (const amount of amounts) {
    if (!Number.isSafeInteger(amount) || amount < 0)
      throw new BillError('range');
    total += BigInt(amount);
  }
  if (total > BigInt(Number.MAX_SAFE_INTEGER)) throw new BillError('range');
  return Number(total);
}
export function overdue(
  bill: { status: string; amountPaisa: number; dueDate: string },
  today = localDate(),
) {
  return (
    bill.status === 'finalized' && bill.amountPaisa > 0 && bill.dueDate < today
  );
}
