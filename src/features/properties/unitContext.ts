import type { SQLiteDatabase } from 'expo-sqlite';
import { getFloor, type Floor } from './floorStore.ts';
import { getProperty, type Property } from './propertyStore.ts';
import type { Unit } from './unitStore';

export type UnitContext = { unit: Unit; floor: Floor; property: Property };
export async function getUnitContext(
  db: SQLiteDatabase,
  unitId: number,
): Promise<UnitContext | undefined> {
  const unit = await db.getFirstAsync<
    Omit<Unit, 'sizeSqFt'> & { sizeSqFt: number | null }
  >(
    `SELECT id,
    floor_id AS floorId, name, size_sq_ft AS sizeSqFt, bedrooms, drawing_rooms AS drawingRooms,
    total_bathrooms AS totalBathrooms, attached_bathrooms AS attachedBathrooms, balconies, notes FROM units WHERE id=?`,
    unitId,
  );
  if (!unit) return undefined;
  const parent = await db.getFirstAsync<{ propertyId: number }>(
    'SELECT property_id AS propertyId FROM floors WHERE id=?',
    unit.floorId,
  );
  if (!parent) return undefined;
  const [floor, property] = await Promise.all([
    getFloor(db, parent.propertyId, unit.floorId),
    getProperty(db, parent.propertyId),
  ]);
  return floor && property
    ? {
        unit: { ...unit, sizeSqFt: unit.sizeSqFt ?? undefined },
        floor,
        property,
      }
    : undefined;
}
