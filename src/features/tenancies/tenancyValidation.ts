import { latinDigits, parsePaisa } from '../../shared/money/paisa.ts';

export type TenancyInput = {
  startDate: string;
  rent: string;
  dueDay: string;
  noticeMonths: string;
  agreedAdvance: string;
};
export type TenancyField = keyof TenancyInput;
export type TenancyErrors = Partial<Record<TenancyField, true>>;

export function localDate(date = new Date()) {
  return `${String(date.getFullYear()).padStart(4, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export function calendarDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const days = [31, leap ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  return (
    year >= 1 && month >= 1 && month <= 12 && day >= 1 && day <= days[month - 1]
  );
}

export function dateForPicker(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setFullYear(year, month - 1, day);
  return date;
}

export function wholeNumber(value: string): number | undefined {
  const text = latinDigits(value);
  if (!/^\d+$/.test(text)) return undefined;
  const result = Number(text);
  return Number.isSafeInteger(result) ? result : undefined;
}

export function validateTenancy(
  input: TenancyInput,
  today = localDate(),
): TenancyErrors {
  const errors: TenancyErrors = {};
  if (!calendarDate(input.startDate) || input.startDate > today)
    errors.startDate = true;
  const rent = parsePaisa(input.rent);
  if (rent === undefined || rent <= 0) errors.rent = true;
  const due = wholeNumber(input.dueDay);
  if (due === undefined || due < 1 || due > 31) errors.dueDay = true;
  if (wholeNumber(input.noticeMonths) === undefined) errors.noticeMonths = true;
  if (parsePaisa(input.agreedAdvance) === undefined)
    errors.agreedAdvance = true;
  return errors;
}

export function parsedTerms(input: TenancyInput) {
  const rentPaisa = parsePaisa(input.rent),
    agreedAdvancePaisa = parsePaisa(input.agreedAdvance);
  const dueDay = wholeNumber(input.dueDay),
    noticeMonths = wholeNumber(input.noticeMonths);
  if (
    rentPaisa === undefined ||
    agreedAdvancePaisa === undefined ||
    dueDay === undefined ||
    noticeMonths === undefined
  )
    return undefined;
  return {
    startDate: input.startDate,
    rentPaisa,
    dueDay,
    noticeMonths,
    agreedAdvancePaisa,
  };
}

export class TenancyError extends Error {
  readonly reason: 'invalid' | 'occupied' | 'missing' | 'billed';
  readonly fields: TenancyErrors;
  constructor(
    reason: 'invalid' | 'occupied' | 'missing' | 'billed',
    fields: TenancyErrors = {},
  ) {
    super(reason);
    this.reason = reason;
    this.fields = fields;
  }
}
