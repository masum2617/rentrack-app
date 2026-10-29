import { hasFinalizedBills } from '../ledger/billingGuards.ts';
import type { SQLiteDatabase } from 'expo-sqlite';
import { parsePaisa } from '../../shared/money/paisa.ts';
import {
  writeChargeVersion,
  type ChargeSettingsInput,
} from './chargeSettings.ts';
import {
  TenancyError,
  validateTenancy,
  wholeNumber,
  type TenancyInput,
} from './tenancyValidation.ts';

export type Tenancy = {
  id: number;
  unitId: number;
  tenantId: number;
  startDate: string;
  rentPaisa: number;
  dueDay: number;
  noticeMonths: number;
  agreedAdvancePaisa: number;
};
export type CurrentTenancy = Tenancy & {
  tenantName: string;
  tenantPhone: string;
};
export type UnitOccupancy = {
  unitId: number;
  unitName: string;
  tenantId: number;
  tenantName: string;
};
export type ActiveRental = UnitOccupancy & {
  tenancyId: number;
  propertyId: number;
  propertyName: string;
  floorId: number;
  floorName: string;
  startDate: string;
};

export async function listActiveRentals(
  db: SQLiteDatabase,
  scope: { tenantId?: number; propertyId?: number } = {},
): Promise<ActiveRental[]> {
  return db.getAllAsync<ActiveRental>(
    `SELECT t.id AS tenancyId, t.tenant_id AS tenantId,
    p.name AS tenantName, t.unit_id AS unitId, u.name AS unitName,
    f.id AS floorId, f.name AS floorName, h.id AS propertyId, h.name AS propertyName,
    t.start_date AS startDate FROM tenancies t
    JOIN tenants p ON p.id=t.tenant_id JOIN units u ON u.id=t.unit_id
    JOIN floors f ON f.id=u.floor_id JOIN properties h ON h.id=f.property_id
    WHERE t.ended_on IS NULL AND (? IS NULL OR t.tenant_id=?) AND (? IS NULL OR h.id=?)
    ORDER BY h.id, f.id, u.id`,
    scope.tenantId ?? null,
    scope.tenantId ?? null,
    scope.propertyId ?? null,
    scope.propertyId ?? null,
  );
}

function values(input: TenancyInput) {
  const errors = validateTenancy(input);
  if (Object.keys(errors).length) throw new TenancyError('invalid', errors);
  // Validation has established these numeric values; keep the guard explicit for callers.
  const rent = parsePaisa(input.rent),
    advance = parsePaisa(input.agreedAdvance);
  const day = wholeNumber(input.dueDay),
    months = wholeNumber(input.noticeMonths);
  if (
    rent === undefined ||
    advance === undefined ||
    day === undefined ||
    months === undefined
  )
    throw new TenancyError('invalid');
  return [input.startDate, rent, day, months, advance];
}

function writeError(error: unknown): never {
  if (
    error instanceof Error &&
    error.message.includes('UNIQUE constraint failed: tenancies.unit_id')
  )
    throw new TenancyError('occupied');
  if (
    error instanceof Error &&
    error.message.includes('FOREIGN KEY constraint failed')
  )
    throw new TenancyError('missing');
  throw error;
}

export async function getCurrentTenancy(
  db: SQLiteDatabase,
  unitId: number,
): Promise<CurrentTenancy | undefined> {
  return (
    (await db.getFirstAsync<CurrentTenancy>(
      `SELECT t.id, t.unit_id AS unitId, t.tenant_id AS tenantId,
    t.start_date AS startDate, t.rent_paisa AS rentPaisa, t.due_day AS dueDay,
    t.notice_months AS noticeMonths, t.agreed_advance_paisa AS agreedAdvancePaisa,
    p.name AS tenantName, p.phone AS tenantPhone
    FROM tenancies t JOIN tenants p ON p.id=t.tenant_id WHERE t.unit_id=? AND t.ended_on IS NULL`,
      unitId,
    )) ?? undefined
  );
}

export async function listFloorOccupancy(
  db: SQLiteDatabase,
  floorId: number,
): Promise<UnitOccupancy[]> {
  return db.getAllAsync<UnitOccupancy>(
    `SELECT t.unit_id AS unitId, u.name AS unitName, t.tenant_id AS tenantId, p.name AS tenantName
    FROM tenancies t JOIN units u ON u.id=t.unit_id JOIN tenants p ON p.id=t.tenant_id
    WHERE u.floor_id=? AND t.ended_on IS NULL`,
    floorId,
  );
}

export async function createTenancy(
  db: SQLiteDatabase,
  unitId: number,
  tenantId: number,
  input: TenancyInput,
  charges?: ChargeSettingsInput,
) {
  const fields = values(input);
  if (await getCurrentTenancy(db, unitId)) throw new TenancyError('occupied');
  const now = new Date().toISOString();
  try {
    let id = 0;
    await db.withExclusiveTransactionAsync(async (tx) => {
      const result = await tx.runAsync(
        `INSERT INTO tenancies (unit_id, tenant_id, start_date, rent_paisa,
      due_day, notice_months, agreed_advance_paisa, created_at, updated_at) VALUES (?,?,?,?,?,?,?,?,?)`,
        unitId,
        tenantId,
        ...fields,
        now,
        now,
      );
      id = result.lastInsertRowId;
      if (charges)
        await writeChargeVersion(tx, id, input.startDate.slice(0, 7), charges);
    });
    return id;
  } catch (error) {
    writeError(error);
  }
}

// Corrections are atomic with the ledger guard; finalized snapshots must be preserved.
export async function correctTenancy(
  db: SQLiteDatabase,
  unitId: number,
  id: number,
  input: TenancyInput,
) {
  const fields = values(input);
  await db.withExclusiveTransactionAsync(async (tx) => {
    const current = await tx.getFirstAsync<{ id: number }>(
      'SELECT id FROM tenancies WHERE id=? AND unit_id=? AND ended_on IS NULL',
      id,
      unitId,
    );
    if (!current) throw new TenancyError('missing');
    if (await hasFinalizedBills(tx, id)) throw new TenancyError('billed');
    const result = await tx.runAsync(
      `UPDATE tenancies SET start_date=?, rent_paisa=?, due_day=?,
      notice_months=?, agreed_advance_paisa=?, updated_at=? WHERE id=? AND unit_id=? AND ended_on IS NULL`,
      ...fields,
      new Date().toISOString(),
      id,
      unitId,
    );
    if (result.changes !== 1) throw new TenancyError('missing');
  });
}
