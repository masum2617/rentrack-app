import type { SQLiteDatabase } from 'expo-sqlite';

// The caller owns a dedicated connection; configure it before BEGIN (not inside it).
export async function runWriteTransaction(
  db: SQLiteDatabase,
  task: (tx: SQLiteDatabase) => Promise<void>,
) {
  await db.execAsync(
    'PRAGMA foreign_keys=ON; PRAGMA busy_timeout=5000; BEGIN IMMEDIATE',
  );
  try {
    await task(db);
    await db.execAsync('COMMIT');
  } catch (error) {
    try {
      await db.execAsync('ROLLBACK');
    } catch {
      /* Preserve the original write error; closing also releases this connection. */
    }
    throw error;
  }
}

// Expo's default exclusive helper creates a fresh connection without FK initialization.
// Adapt that one entry point so existing stores and migrations keep the same small API.
export function configureWriteTransactions(db: SQLiteDatabase) {
  db.withExclusiveTransactionAsync = async (task) => {
    const { openDatabaseAsync } = await import('expo-sqlite');
    const separator = db.databasePath.lastIndexOf('/');
    if (separator < 0)
      throw new Error('A persistent database path is required');
    const connection = await openDatabaseAsync(
      db.databasePath.slice(separator + 1),
      { ...db.options, useNewConnection: true },
      db.databasePath.slice(0, separator),
    );
    try {
      await runWriteTransaction(connection, task);
    } finally {
      await connection.closeAsync();
    }
  };
  return db;
}
