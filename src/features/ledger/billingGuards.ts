import type { SQLiteDatabase } from 'expo-sqlite';

export async function hasFinalizedBills(db: SQLiteDatabase, tenancyId: number) {
  return Boolean(
    await db.getFirstAsync<{ id: number }>(
      "SELECT id FROM bills WHERE tenancy_id=? AND status='finalized' LIMIT 1",
      tenancyId,
    ),
  );
}
