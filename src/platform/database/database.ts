import { openDatabaseAsync, type SQLiteDatabase } from 'expo-sqlite';
import { migrateDatabase } from './migrations';

let database: Promise<SQLiteDatabase> | undefined;

async function openDatabase() {
  const db = await openDatabaseAsync('house-rent-tracker.db');
  try {
    await migrateDatabase(db);
    return db;
  } catch (error) {
    await db.closeAsync();
    throw error;
  }
}

export function getDatabase() {
  if (!database) {
    database = openDatabase().catch((error: unknown) => {
      database = undefined;
      throw error;
    });
  }
  return database;
}
