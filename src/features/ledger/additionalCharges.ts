import { parsePaisa, paisaInput } from '../../shared/money/paisa.ts';
import {
  chargeKinds,
  type ChargeKind,
  type ChargeVersion,
} from '../tenancies/chargeSettings.ts';
import { BillError, reviewedAmount, safeTotal } from './billCalculations.ts';

export type BillLine = {
  id: number;
  kind: 'rent' | ChargeKind | 'other';
  name: string;
  position: number;
  sourceMode: 'rent' | 'fixed' | 'manual' | 'oneoff';
  referencePaisa: number;
  proposedPaisa: number;
  amountPaisa: number;
  paidPaisa?: number;
  overrideReason: string;
};
export type ExtraInput = {
  key: string;
  kind: ChargeKind | 'other';
  name: string;
  amount: string;
  reason: string;
};
export class ExtraError extends Error {
  readonly index: number;
  readonly field: 'amount' | 'reason' | 'name';
  constructor(index: number, field: 'amount' | 'reason' | 'name') {
    super(field);
    this.index = index;
    this.field = field;
  }
}
export function normalizedChargeName(name: string) {
  return name.normalize('NFKC').trim().replace(/\s+/g, ' ').toLowerCase();
}
export function initialExtras(version?: ChargeVersion): ExtraInput[] {
  return chargeKinds
    .filter((kind) => version && version.settings[kind].mode !== 'none')
    .map((kind) => ({
      key: kind,
      kind,
      name: kind,
      amount:
        version?.settings[kind].mode === 'fixed'
          ? paisaInput(version.settings[kind].amountPaisa)
          : '',
      reason: '',
    }));
}
export function savedExtras(lines: BillLine[]): ExtraInput[] {
  return lines
    .filter((line) => line.kind !== 'rent')
    .map((line) => ({
      key: String(line.id),
      kind: line.kind === 'rent' ? 'other' : line.kind,
      name: line.name,
      amount: paisaInput(line.amountPaisa),
      reason: line.overrideReason,
    }));
}
export function prepareExtras(
  inputs: ExtraInput[],
  version?: ChargeVersion,
): Omit<BillLine, 'id'>[] {
  const expected = initialExtras(version);
  for (const entry of expected)
    if (inputs.filter((input) => input.kind === entry.kind).length !== 1)
      throw new BillError('termsChanged');
  const names = new Set<string>();
  const lines = inputs.map((input, index) => {
    const name = input.name.trim(),
      key = normalizedChargeName(name);
    if (input.kind === 'other' && (!name || names.has(key)))
      throw new ExtraError(index, 'name');
    if (input.kind === 'other') names.add(key);
    if (
      input.kind !== 'other' &&
      !expected.some((entry) => entry.kind === input.kind)
    )
      throw new BillError('termsChanged');
    const setting =
      input.kind === 'other' ? undefined : version?.settings[input.kind];
    const amount = parsePaisa(input.amount);
    if (amount === undefined || amount < 0)
      throw new ExtraError(index, 'amount');
    const proposed = setting?.mode === 'fixed' ? setting.amountPaisa : amount;
    if (amount !== proposed && !input.reason.trim())
      throw new ExtraError(index, 'reason');
    reviewedAmount(input.amount, input.reason, proposed);
    const sourceMode =
      setting?.mode === 'fixed'
        ? 'fixed'
        : setting?.mode === 'manual'
          ? 'manual'
          : 'oneoff';
    return {
      kind: input.kind,
      name,
      position: index + 1,
      sourceMode,
      referencePaisa: proposed,
      proposedPaisa: proposed,
      amountPaisa: amount,
      overrideReason: amount === proposed ? '' : input.reason.trim(),
    } satisfies Omit<BillLine, 'id'>;
  });
  safeTotal(lines.map((line) => line.amountPaisa));
  return lines;
}
