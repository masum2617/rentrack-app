import type { SQLiteDatabase } from 'expo-sqlite';

export type PropertyInput = {
  name: string;
  location: string;
  address: string;
};

export type Property = PropertyInput & { id: number };
export type PropertySummary = Property & {
  floorCount: number;
  unitCount: number;
  rentedUnitCount: number;
};
export type PropertyErrors = Partial<Record<'name' | 'location', true>>;

export function validateProperty(input: PropertyInput): PropertyErrors {
  return {
    ...(input.name.trim() ? {} : { name: true }),
    ...(input.location.trim() ? {} : { location: true }),
  };
}

function prepareInput(input: PropertyInput) {
  if (Object.keys(validateProperty(input)).length) {
    throw new Error('House name and location are required');
  }
  return [input.name.trim(), input.location.trim(), input.address.trim()];
}

export function filterProperties<T extends Property>(
  properties: T[],
  search: string,
) {
  const query = search.trim().normalize('NFC').toLowerCase();
  return properties.filter((property) =>
    [property.name, property.location, property.address].some((value) =>
      value.normalize('NFC').toLowerCase().includes(query),
    ),
  );
}

export async function listProperties(db: SQLiteDatabase): Promise<Property[]> {
  return db.getAllAsync<Property>(
    'SELECT id, name, location, address FROM properties ORDER BY id DESC',
  );
}

export async function getProperty(
  db: SQLiteDatabase,
  id: number,
): Promise<Property | undefined> {
  return (
    (await db.getFirstAsync<Property>(
      'SELECT id, name, location, address FROM properties WHERE id = ?',
      id,
    )) ?? undefined
  );
}

export async function listPropertySummaries(
  db: SQLiteDatabase,
): Promise<PropertySummary[]> {
  return db.getAllAsync<PropertySummary>(`
    SELECT p.id, p.name, p.location, p.address,
      (SELECT count(*) FROM floors f WHERE f.property_id = p.id) AS floorCount,
      (SELECT count(*) FROM units u JOIN floors f ON f.id = u.floor_id WHERE f.property_id = p.id) AS unitCount,
      (SELECT count(*) FROM tenancies t JOIN units u ON u.id=t.unit_id JOIN floors f ON f.id=u.floor_id
        WHERE f.property_id=p.id AND t.ended_on IS NULL) AS rentedUnitCount
    FROM properties p ORDER BY p.id DESC
  `);
}

export async function createProperty(db: SQLiteDatabase, input: PropertyInput) {
  const values = prepareInput(input);
  const now = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO properties (name, location, address, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?)`,
    ...values,
    now,
    now,
  );
  return result.lastInsertRowId;
}

export async function updateProperty(
  db: SQLiteDatabase,
  id: number,
  input: PropertyInput,
) {
  const values = prepareInput(input);
  const result = await db.runAsync(
    `UPDATE properties SET name = ?, location = ?, address = ?, updated_at = ?
     WHERE id = ?`,
    ...values,
    new Date().toISOString(),
    id,
  );
  if (result.changes !== 1) throw new Error('House no longer exists');
}
