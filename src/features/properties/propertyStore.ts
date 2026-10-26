import type { SQLiteDatabase } from 'expo-sqlite';

export type PropertyInput = {
  name: string;
  location: string;
  address: string;
};

export type Property = PropertyInput & { id: number };
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

export function filterProperties(properties: Property[], search: string) {
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
