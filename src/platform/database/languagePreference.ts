import type { SQLiteDatabase } from 'expo-sqlite';
import type { Locale } from '../../i18n/formatNumber';

export async function readLanguage(db: SQLiteDatabase): Promise<Locale> {
  const row = await db.getFirstAsync<{ language: string }>(
    'SELECT language FROM device_preferences WHERE id = 1',
  );
  if (!row) return 'bn';
  if (row.language === 'bn' || row.language === 'en') return row.language;
  throw new Error('Invalid saved language');
}

export async function writeLanguage(db: SQLiteDatabase, language: Locale) {
  await db.runAsync(
    `INSERT INTO device_preferences (id, language) VALUES (1, ?)
     ON CONFLICT(id) DO UPDATE SET language = excluded.language`,
    language,
  );
}
