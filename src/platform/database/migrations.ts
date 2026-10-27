import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateDatabase(db: SQLiteDatabase) {
  // SQLite ignores changes to this setting inside an active transaction.
  await db.execAsync("PRAGMA foreign_keys = ON");
  await db.withExclusiveTransactionAsync(async (transaction) => {
    const row = await transaction.getFirstAsync<{ user_version: number }>(
      "PRAGMA user_version",
    );
    const version = row?.user_version ?? 0;
    if (version > 6) throw new Error("Database requires a newer app version");
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
    if (version < 3) {
      await transaction.execAsync(`
        CREATE TABLE floors (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          property_id INTEGER NOT NULL REFERENCES properties(id),
          name TEXT NOT NULL CHECK (length(trim(name)) > 0),
          name_key TEXT NOT NULL CHECK (length(name_key) > 0),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          UNIQUE (property_id, name_key)
        );
        PRAGMA user_version = 3;
      `);
    }
    if (version < 4) {
      // Some development databases already have the edited v3 column; keep it.
      const columns = await transaction.getAllAsync<{ name: string }>(
        "PRAGMA table_info(floors)",
      );
      const code = columns.some((column) => column.name === "floor_code_name")
        ? "COALESCE(floor_code_name, '')"
        : "''";
      await transaction.execAsync(`
        CREATE TABLE floors_v4 (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          property_id INTEGER NOT NULL REFERENCES properties(id),
          name TEXT NOT NULL CHECK (length(trim(name)) > 0),
          name_key TEXT NOT NULL CHECK (length(name_key) > 0),
          floor_code_name TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          UNIQUE (property_id, name_key)
        );
        INSERT INTO floors_v4
          (id, property_id, name, name_key, floor_code_name, created_at, updated_at)
          SELECT id, property_id, name, name_key, ${code}, created_at, updated_at FROM floors;
        UPDATE sqlite_sequence
          SET seq = max(seq, COALESCE((SELECT seq FROM sqlite_sequence WHERE name = 'floors'), 0))
          WHERE name = 'floors_v4';
        DROP TABLE floors;
        ALTER TABLE floors_v4 RENAME TO floors;
        PRAGMA user_version = 4;
      `);
    }
    if (version < 5) {
      await transaction.execAsync(`
        CREATE TABLE units (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          floor_id INTEGER NOT NULL REFERENCES floors(id),
          name TEXT NOT NULL CHECK (length(trim(name)) > 0),
          name_key TEXT NOT NULL CHECK (length(name_key) > 0),
          size_sq_ft REAL NOT NULL CHECK (size_sq_ft > 0),
          bedrooms INTEGER NOT NULL CHECK (typeof(bedrooms) = 'integer' AND bedrooms >= 0),
          drawing_rooms INTEGER NOT NULL CHECK (typeof(drawing_rooms) = 'integer' AND drawing_rooms >= 0),
          total_bathrooms INTEGER NOT NULL CHECK (typeof(total_bathrooms) = 'integer' AND total_bathrooms >= 0),
          attached_bathrooms INTEGER NOT NULL CHECK (typeof(attached_bathrooms) = 'integer' AND attached_bathrooms >= 0 AND attached_bathrooms <= total_bathrooms),
          balconies INTEGER NOT NULL CHECK (typeof(balconies) = 'integer' AND balconies >= 0),
          notes TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          UNIQUE (floor_id, name_key)
        );
        PRAGMA user_version = 5;
      `);
    }
    if (version < 6) {
      // v5 reached the development emulator before size was confirmed optional.
      await transaction.execAsync(`
        CREATE TABLE units_v6 (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          floor_id INTEGER NOT NULL REFERENCES floors(id),
          name TEXT NOT NULL CHECK (length(trim(name)) > 0),
          name_key TEXT NOT NULL CHECK (length(name_key) > 0),
          size_sq_ft REAL CHECK (size_sq_ft IS NULL OR size_sq_ft > 0),
          bedrooms INTEGER NOT NULL CHECK (typeof(bedrooms) = 'integer' AND bedrooms >= 0),
          drawing_rooms INTEGER NOT NULL CHECK (typeof(drawing_rooms) = 'integer' AND drawing_rooms >= 0),
          total_bathrooms INTEGER NOT NULL CHECK (typeof(total_bathrooms) = 'integer' AND total_bathrooms >= 0),
          attached_bathrooms INTEGER NOT NULL CHECK (typeof(attached_bathrooms) = 'integer' AND attached_bathrooms >= 0 AND attached_bathrooms <= total_bathrooms),
          balconies INTEGER NOT NULL CHECK (typeof(balconies) = 'integer' AND balconies >= 0),
          notes TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          UNIQUE (floor_id, name_key)
        );
        INSERT INTO units_v6 SELECT * FROM units;
        UPDATE sqlite_sequence
          SET seq = max(seq, COALESCE((SELECT seq FROM sqlite_sequence WHERE name = 'units'), 0))
          WHERE name = 'units_v6';
        DROP TABLE units;
        ALTER TABLE units_v6 RENAME TO units;
        PRAGMA user_version = 6;
      `);
    }
  });
}
