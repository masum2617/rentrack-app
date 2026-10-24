import type { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDatabase(db: SQLiteDatabase) {
  await db.withExclusiveTransactionAsync(async (transaction) => {
    const row = await transaction.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version',
    );
    const version = row?.user_version ?? 0;
    if (version > 1) throw new Error('Database requires a newer app version');
    if (version === 0) {
      await transaction.execAsync(`
        CREATE TABLE device_preferences (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          language TEXT NOT NULL CHECK (language IN ('bn', 'en'))
        );
        PRAGMA user_version = 1;
      `);
    }
  });
}
