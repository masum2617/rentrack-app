import type { SQLiteDatabase } from "expo-sqlite";

export type Floor = {
  id: number;
  propertyId: number;
  name: string;
  floorCodeName?: string;
};
export type FloorSummary = Floor & {
  unitCount: number;
  rentedUnitCount: number;
};

export async function listFloorSummaries(
  db: SQLiteDatabase,
  propertyId: number,
): Promise<FloorSummary[]> {
  return db.getAllAsync<FloorSummary>(
    `SELECT f.id, f.property_id AS propertyId,
    f.name, f.floor_code_name AS floorCodeName,
    (SELECT count(*) FROM units u WHERE u.floor_id=f.id) AS unitCount,
    (SELECT count(*) FROM tenancies t JOIN units u ON u.id=t.unit_id
      WHERE u.floor_id=f.id AND t.ended_on IS NULL) AS rentedUnitCount
    FROM floors f WHERE f.property_id=? ORDER BY f.id`,
    propertyId,
  );
}
export class FloorNameError extends Error {
  readonly reason: "required" | "duplicate";
  constructor(reason: "required" | "duplicate") {
    super(reason);
    this.reason = reason;
  }
}

function prepareName(value: string) {
  const name = value.trim();
  if (!name) throw new FloorNameError("required");
  return {
    name,
    key: name.normalize("NFC").replace(/\s+/g, " ").toLowerCase(),
  };
}

function rethrowWriteError(error: unknown): never {
  if (
    error instanceof Error &&
    error.message.includes(
      "UNIQUE constraint failed: floors.property_id, floors.name_key",
    )
  ) {
    throw new FloorNameError("duplicate");
  }
  throw error;
}

export async function listFloors(
  db: SQLiteDatabase,
  propertyId: number,
): Promise<Floor[]> {
  return db.getAllAsync<Floor>(
    "SELECT id, property_id AS propertyId, name, floor_code_name AS floorCodeName FROM floors WHERE property_id = ? ORDER BY id ASC",
    propertyId,
  );
}

export async function getFloor(
  db: SQLiteDatabase,
  propertyId: number,
  id: number,
): Promise<Floor | undefined> {
  return (
    (await db.getFirstAsync<Floor>(
      "SELECT id, property_id AS propertyId, name, floor_code_name AS floorCodeName FROM floors WHERE id = ? AND property_id = ?",
      id,
      propertyId,
    )) ?? undefined
  );
}

export async function createFloor(
  db: SQLiteDatabase,
  propertyId: number,
  value: string,
  floorCodeName = "",
) {
  const { name, key } = prepareName(value);
  const now = new Date().toISOString();
  try {
    const result = await db.runAsync(
      "INSERT INTO floors (property_id, name, name_key, floor_code_name, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)",
      propertyId,
      name,
      key,
      floorCodeName.trim(),
      now,
      now,
    );
    return result.lastInsertRowId;
  } catch (error) {
    rethrowWriteError(error);
  }
}

export async function updateFloor(
  db: SQLiteDatabase,
  propertyId: number,
  id: number,
  value: string,
  floorCodeName = "",
) {
  const { name, key } = prepareName(value);
  try {
    const result = await db.runAsync(
      "UPDATE floors SET name = ?, name_key = ?, floor_code_name = ?, updated_at = ? WHERE id = ? AND property_id = ?",
      name,
      key,
      floorCodeName.trim(),
      new Date().toISOString(),
      id,
      propertyId,
    );
    if (result.changes !== 1)
      throw new Error("Floor no longer exists in this house");
  } catch (error) {
    rethrowWriteError(error);
  }
}
