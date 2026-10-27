export type UnitInput = {
  name: string;
  sizeSqFt: string;
  bedrooms: string;
  drawingRooms: string;
  totalBathrooms: string;
  attachedBathrooms: string;
  balconies: string;
  notes: string;
};
export type UnitField = keyof UnitInput;
export type UnitError = 'required' | 'positiveSize' | 'wholeCount' | 'attachedTotal' | 'duplicate';
export type UnitErrors = Partial<Record<UnitField, UnitError>>;

export function normalizeUnitNumber(value: string) {
  return value.trim().replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)));
}
export function parseUnitCount(value: string): number | undefined {
  const normalized = normalizeUnitNumber(value);
  if (!/^\d+$/.test(normalized)) return undefined;
  const count = Number(normalized);
  return Number.isSafeInteger(count) ? count : undefined;
}
export function validateUnit(input: UnitInput): UnitErrors {
  const errors: UnitErrors = {};
  if (!input.name.trim()) errors.name = 'required';
  const size = normalizeUnitNumber(input.sizeSqFt);
  if (size && (!/^\d+(\.\d+)?$/.test(size) || !Number.isFinite(Number(size)) || Number(size) <= 0)) errors.sizeSqFt = 'positiveSize';
  const fields = ['bedrooms', 'drawingRooms', 'totalBathrooms', 'attachedBathrooms', 'balconies'] as const;
  for (const field of fields) if (parseUnitCount(input[field]) === undefined) errors[field] = 'wholeCount';
  const total = parseUnitCount(input.totalBathrooms), attached = parseUnitCount(input.attachedBathrooms);
  if (total !== undefined && attached !== undefined && attached > total) errors.attachedBathrooms = 'attachedTotal';
  return errors;
}
export class UnitValidationError extends Error {
  readonly fields: UnitErrors;
  constructor(fields: UnitErrors) {
    super('Invalid unit information');
    this.fields = fields;
  }
}
