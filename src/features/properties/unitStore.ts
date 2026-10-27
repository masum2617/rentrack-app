import type { SQLiteDatabase } from 'expo-sqlite';
import { normalizeUnitNumber, validateUnit, UnitValidationError, type UnitInput } from './unitValidation.ts';

export type Unit = {
  id: number;
  floorId: number;
  name: string;
  sizeSqFt?: number;
  bedrooms: number;
  drawingRooms: number;
  totalBathrooms: number;
  attachedBathrooms: number;
  balconies: number;
  notes: string;
};

function prepare(input: UnitInput) {
  const errors = validateUnit(input);
  if (Object.keys(errors).length) throw new UnitValidationError(errors);
  const name = input.name.trim();
  return [name, name.normalize('NFC').replace(/\s+/g, ' ').toLowerCase(),
    input.sizeSqFt.trim() ? Number(normalizeUnitNumber(input.sizeSqFt)) : null, Number(normalizeUnitNumber(input.bedrooms)),
    Number(normalizeUnitNumber(input.drawingRooms)), Number(normalizeUnitNumber(input.totalBathrooms)),
    Number(normalizeUnitNumber(input.attachedBathrooms)), Number(normalizeUnitNumber(input.balconies)), input.notes.trim()];
}

function writeError(error: unknown): never {
  if (error instanceof Error && error.message.includes('UNIQUE constraint failed: units.floor_id, units.name_key')) {
    throw new UnitValidationError({ name: 'duplicate' });
  }
  throw error;
}

export async function listUnits(db: SQLiteDatabase, floorId: number): Promise<Unit[]> {
  const rows = await db.getAllAsync<Omit<Unit, 'sizeSqFt'> & { sizeSqFt: number | null }>(`SELECT id, floor_id AS floorId, name, size_sq_ft AS sizeSqFt,
    bedrooms, drawing_rooms AS drawingRooms, total_bathrooms AS totalBathrooms,
    attached_bathrooms AS attachedBathrooms, balconies, notes
    FROM units WHERE floor_id = ? ORDER BY id ASC`, floorId);
  return rows.map((row) => ({ ...row, sizeSqFt: row.sizeSqFt ?? undefined }));
}

export async function createUnit(db: SQLiteDatabase, floorId: number, input: UnitInput) {
  const values = prepare(input), now = new Date().toISOString();
  try {
    const result = await db.runAsync(`INSERT INTO units (floor_id, name, name_key, size_sq_ft,
      bedrooms, drawing_rooms, total_bathrooms, attached_bathrooms, balconies, notes, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`, floorId, ...values, now, now);
    return result.lastInsertRowId;
  } catch (error) { writeError(error); }
}

export async function updateUnit(db: SQLiteDatabase, floorId: number, id: number, input: UnitInput) {
  const values = prepare(input);
  try {
    const result = await db.runAsync(`UPDATE units SET name = ?, name_key = ?, size_sq_ft = ?,
      bedrooms = ?, drawing_rooms = ?, total_bathrooms = ?, attached_bathrooms = ?, balconies = ?, notes = ?, updated_at = ?
      WHERE id = ? AND floor_id = ?`, ...values, new Date().toISOString(), id, floorId);
    if (result.changes !== 1) throw new Error('Unit no longer exists on this floor');
  } catch (error) { writeError(error); }
}
