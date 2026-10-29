import type { SQLiteDatabase } from 'expo-sqlite';
import { parsePaisa, paisaInput } from '../../shared/money/paisa.ts';
import { calendarDate } from './tenancyValidation.ts';

export type ChargeKind = 'water' | 'service' | 'gas';
export type ChargeMode = 'none' | 'fixed' | 'manual';
export type ChargeSetting = { mode: ChargeMode; amountPaisa: number };
export type ChargeSettings = Record<ChargeKind, ChargeSetting>;
export type ChargeSettingsInput = Record<
  ChargeKind,
  { mode: ChargeMode; amount: string }
>;
export type ChargeVersion = {
  id: number;
  tenancyId: number;
  effectiveMonth: string;
  settings: ChargeSettings;
};
export const chargeKinds: ChargeKind[] = ['water', 'service', 'gas'];
export function emptyChargeInput(): ChargeSettingsInput {
  return {
    water: { mode: 'none', amount: '' },
    service: { mode: 'none', amount: '' },
    gas: { mode: 'none', amount: '' },
  };
}
export class ChargeError extends Error {
  readonly code: 'invalid' | 'missing' | 'duplicate' | 'locked' | 'stale';
  readonly field?: ChargeKind;
  readonly month?: string;
  constructor(
    code: 'invalid' | 'missing' | 'duplicate' | 'locked' | 'stale',
    field?: ChargeKind,
    month?: string,
  ) {
    super(code);
    this.code = code;
    this.field = field;
    this.month = month;
  }
}
export function parseChargeSettings(
  input: ChargeSettingsInput,
): ChargeSettings {
  function parse(kind: ChargeKind): ChargeSetting {
    const entry = input[kind];
    if (
      !['none', 'fixed', 'manual'].includes(entry.mode) ||
      (kind !== 'water' && entry.mode === 'manual')
    )
      throw new ChargeError('invalid', kind);
    const amount = entry.mode === 'fixed' ? parsePaisa(entry.amount) : 0;
    if (amount === undefined || amount < 0)
      throw new ChargeError('invalid', kind);
    return { mode: entry.mode, amountPaisa: amount };
  }
  return {
    water: parse('water'),
    service: parse('service'),
    gas: parse('gas'),
  };
}
export function chargeInput(settings: ChargeSettings): ChargeSettingsInput {
  function entry(kind: ChargeKind) {
    return {
      mode: settings[kind].mode,
      amount:
        settings[kind].mode === 'fixed'
          ? paisaInput(settings[kind].amountPaisa)
          : '',
    };
  }
  return {
    water: entry('water'),
    service: entry('service'),
    gas: entry('gas'),
  };
}
type VersionRow = {
  id: number;
  tenancyId: number;
  effectiveMonth: string;
  waterMode: ChargeMode;
  waterAmount: number;
  serviceMode: ChargeMode;
  serviceAmount: number;
  gasMode: ChargeMode;
  gasAmount: number;
};
export async function listChargeVersions(
  db: SQLiteDatabase,
  tenancyId: number,
): Promise<ChargeVersion[]> {
  const rows = await db.getAllAsync<VersionRow>(
    `SELECT id, tenancy_id AS tenancyId, effective_month AS effectiveMonth,
    water_mode AS waterMode, water_paisa AS waterAmount, service_mode AS serviceMode, service_paisa AS serviceAmount,
    gas_mode AS gasMode, gas_paisa AS gasAmount FROM tenancy_charge_versions WHERE tenancy_id=? ORDER BY effective_month`,
    tenancyId,
  );
  return rows.map((row) => ({
    id: row.id,
    tenancyId: row.tenancyId,
    effectiveMonth: row.effectiveMonth,
    settings: {
      water: { mode: row.waterMode, amountPaisa: row.waterAmount },
      service: { mode: row.serviceMode, amountPaisa: row.serviceAmount },
      gas: { mode: row.gasMode, amountPaisa: row.gasAmount },
    },
  }));
}
export function applicableCharges(
  versions: ChargeVersion[],
  month: string,
): ChargeVersion | undefined {
  return versions.filter((version) => version.effectiveMonth <= month).at(-1);
}
export function chargeSignature(version?: ChargeVersion) {
  if (!version) return '';
  return JSON.stringify([
    version.id,
    version.effectiveMonth,
    ...chargeKinds.flatMap((kind) => [
      version.settings[kind].mode,
      version.settings[kind].amountPaisa,
    ]),
  ]);
}
// Caller owns the transaction, including when used during tenancy creation.
export async function writeChargeVersion(
  db: SQLiteDatabase,
  tenancyId: number,
  month: string,
  input: ChargeSettingsInput,
  versionId?: number,
) {
  const settings = parseChargeSettings(input);
  const tenancy = await db.getFirstAsync<{
    startDate: string;
    endedOn: string | null;
  }>(
    'SELECT start_date AS startDate, ended_on AS endedOn FROM tenancies WHERE id=?',
    tenancyId,
  );
  if (!tenancy || tenancy.endedOn) throw new ChargeError('missing');
  if (
    !/^\d{4}-\d{2}$/.test(month) ||
    !calendarDate(`${month}-01`) ||
    month < tenancy.startDate.slice(0, 7)
  )
    throw new ChargeError('invalid');
  const versions = await listChargeVersions(db, tenancyId);
  const current =
    versionId === undefined
      ? undefined
      : versions.find((version) => version.id === versionId);
  if (versionId !== undefined && !current) throw new ChargeError('missing');
  // Existing boundaries are fixed; shifting one would alter two different periods.
  if (current && current.effectiveMonth !== month)
    throw new ChargeError('invalid');
  if (
    versions.some(
      (version) => version.effectiveMonth === month && version.id !== versionId,
    )
  )
    throw new ChargeError('duplicate');
  const next = versions.find((version) => version.effectiveMonth > month);
  const blocked = await db.getFirstAsync<{ month: string }>(
    `SELECT billing_month AS month FROM bills WHERE tenancy_id=? AND status='finalized'
    AND billing_month>=? AND (? IS NULL OR billing_month<?) ORDER BY billing_month LIMIT 1`,
    tenancyId,
    month,
    next?.effectiveMonth ?? null,
    next?.effectiveMonth ?? null,
  );
  if (blocked) throw new ChargeError('locked', undefined, blocked.month);
  const values = [
    settings.water.mode,
    settings.water.amountPaisa,
    settings.service.mode,
    settings.service.amountPaisa,
    settings.gas.mode,
    settings.gas.amountPaisa,
  ];
  const now = new Date().toISOString();
  if (current) {
    await db.runAsync(
      `UPDATE tenancy_charge_versions SET water_mode=?,water_paisa=?,service_mode=?,service_paisa=?,gas_mode=?,gas_paisa=?,updated_at=? WHERE id=? AND tenancy_id=?`,
      ...values,
      now,
      current.id,
      tenancyId,
    );
    return current.id;
  }
  const result = await db.runAsync(
    `INSERT INTO tenancy_charge_versions (tenancy_id,effective_month,water_mode,water_paisa,service_mode,service_paisa,gas_mode,gas_paisa,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?,?)`,
    tenancyId,
    month,
    ...values,
    now,
    now,
  );
  return result.lastInsertRowId;
}
export async function saveChargeVersion(
  db: SQLiteDatabase,
  tenancyId: number,
  month: string,
  input: ChargeSettingsInput,
  versionId?: number,
) {
  await db.withExclusiveTransactionAsync(async (tx) => {
    await writeChargeVersion(tx, tenancyId, month, input, versionId);
  });
}
