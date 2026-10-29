import type { SQLiteDatabase } from 'expo-sqlite';

export type TenantInput = {
  name: string;
  phone: string;
  address: string;
  idType: string;
  idNumber: string;
  emergencyContact: string;
  notes: string;
};
export type Tenant = TenantInput & { id: number };

export function validateTenant(input: TenantInput) {
  return input.name.trim().length > 0;
}

function values(input: TenantInput) {
  if (!validateTenant(input)) throw new Error('Tenant name is required');
  return [
    input.name.trim(),
    input.phone.trim(),
    input.address.trim(),
    input.idType.trim(),
    input.idNumber.trim(),
    input.emergencyContact.trim(),
    input.notes.trim(),
  ];
}

export async function listTenants(db: SQLiteDatabase): Promise<Tenant[]> {
  return db.getAllAsync<Tenant>(`SELECT id, name, phone, address,
    id_type AS idType, id_number AS idNumber, emergency_contact AS emergencyContact, notes
    FROM tenants ORDER BY id DESC`);
}

export async function getTenant(
  db: SQLiteDatabase,
  id: number,
): Promise<Tenant | undefined> {
  return (
    (await db.getFirstAsync<Tenant>(
      `SELECT id, name, phone, address,
    id_type AS idType, id_number AS idNumber, emergency_contact AS emergencyContact, notes
    FROM tenants WHERE id=?`,
      id,
    )) ?? undefined
  );
}

export function filterTenants<T extends Tenant>(tenants: T[], search: string) {
  // Compare Bangla/English phone digits without changing the stored identity.
  const normalized = (value: string) =>
    value
      .normalize('NFC')
      .toLowerCase()
      .replace(/[০-৯]/g, (digit) => String('০১২৩৪৫৬৭৮৯'.indexOf(digit)));
  const query = normalized(search.trim());
  const phoneQuery = query.replace(/[\s()+.\-]/g, '');
  return tenants.filter((tenant) => {
    const textMatches = [tenant.name, tenant.phone, tenant.address].some(
      (value) => normalized(value).includes(query),
    );
    const phoneMatches =
      /^\d+$/.test(phoneQuery) &&
      normalized(tenant.phone)
        .replace(/[\s()+.\-]/g, '')
        .includes(phoneQuery);
    return textMatches || phoneMatches;
  });
}

export async function createTenant(db: SQLiteDatabase, input: TenantInput) {
  const fields = values(input),
    now = new Date().toISOString();
  const result = await db.runAsync(
    `INSERT INTO tenants
    (name, phone, address, id_type, id_number, emergency_contact, notes, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    ...fields,
    now,
    now,
  );
  return result.lastInsertRowId;
}

export async function updateTenant(
  db: SQLiteDatabase,
  id: number,
  input: TenantInput,
) {
  const result = await db.runAsync(
    `UPDATE tenants SET name = ?, phone = ?, address = ?,
    id_type = ?, id_number = ?, emergency_contact = ?, notes = ?, updated_at = ? WHERE id = ?`,
    ...values(input),
    new Date().toISOString(),
    id,
  );
  if (result.changes !== 1) throw new Error('Tenant no longer exists');
}
