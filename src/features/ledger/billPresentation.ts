import type { Locale } from '../../i18n/formatNumber';
import type { MessageKey } from '../../i18n/messages';
import { dateForPicker } from '../tenancies/tenancyValidation.ts';
import { BillError, overdue, type BillProblem } from './billCalculations.ts';
import type { Bill } from './billStore';

export function billDate(date: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    calendar: 'gregory',
  }).format(dateForPicker(date));
}
export function billMonth(month: string, locale: Locale) {
  return new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    month: 'long',
    year: 'numeric',
    calendar: 'gregory',
  }).format(dateForPicker(`${month}-01`));
}
export function billStatus(bill: Bill): MessageKey {
  if (bill.status === 'draft') return 'billDraft';
  if (bill.status === 'void') return 'billVoided';
  if (!bill.amountPaisa) return 'billNoDues';
  if (!bill.outstandingPaisa) return 'paymentSettled';
  return bill.paidPaisa ? 'paymentPartial' : 'billUnpaid';
}
export function billIsOverdue(bill: Bill, today?: string) {
  return overdue({ ...bill, amountPaisa: bill.outstandingPaisa }, today);
}
const problems: Record<BillProblem, MessageKey> = {
  month: 'billMonthError',
  amount: 'billAmountError',
  reason: 'billReasonError',
  duplicate: 'billDuplicateError',
  missing: 'billMissing',
  readonly: 'billReadonlyError',
  termsChanged: 'billTermsChanged',
  closed: 'billClosedError',
  range: 'billRangeError',
  allocated: 'paymentBillLocked',
  save: 'billSaveError',
};
export function billError(error: unknown): MessageKey {
  return error instanceof BillError ? problems[error.code] : 'billSaveError';
}
