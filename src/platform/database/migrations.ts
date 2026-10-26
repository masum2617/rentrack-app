import type { SQLiteDatabase } from 'expo-sqlite';

export async function migrateDatabase(db: SQLiteDatabase) {
  await db.withExclusiveTransactionAsync(async (transaction) => {
    const row = await transaction.getFirstAsync<{ user_version: number }>(
      'PRAGMA user_version',
    );
    const version = row?.user_version ?? 0;
    if (version > 2) throw new Error('Database requires a newer app version');
    if (version < 1) {
      await transaction.execAsync(`
        CREATE TABLE device_preferences (
          id INTEGER PRIMARY KEY CHECK (id = 1),
          language TEXT NOT NULL CHECK (language IN ('bn', 'en'))
        );
        PRAGMA user_version = 1;
      `);
    }
    if (version < 2) {
      await transaction.execAsync(`
        CREATE TABLE properties (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL CHECK (length(trim(name)) > 0),
          location TEXT NOT NULL CHECK (length(trim(location)) > 0),
          address TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        PRAGMA user_version = 2;
      `);
    }
  });
}
