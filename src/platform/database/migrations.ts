import type { SQLiteDatabase } from "expo-sqlite";

export async function migrateDatabase(db: SQLiteDatabase) {
  // SQLite ignores changes to this setting inside an active transaction.
  await db.execAsync("PRAGMA foreign_keys = ON");
  await db.withExclusiveTransactionAsync(async (transaction) => {
    const row = await transaction.getFirstAsync<{ user_version: number }>(
      "PRAGMA user_version",
    );
    const version = row?.user_version ?? 0;
    if (version > 11) throw new Error("Database requires a newer app version");
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
    if (version < 7) {
      await transaction.execAsync(`
        CREATE TABLE tenants (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          name TEXT NOT NULL CHECK (length(trim(name)) > 0),
          phone TEXT NOT NULL DEFAULT '',
          address TEXT NOT NULL DEFAULT '',
          id_type TEXT NOT NULL DEFAULT '',
          id_number TEXT NOT NULL DEFAULT '',
          emergency_contact TEXT NOT NULL DEFAULT '',
          notes TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        PRAGMA user_version = 7;
      `);
    }
    if (version < 8) {
      await transaction.execAsync(`
        CREATE TABLE tenancies (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          unit_id INTEGER NOT NULL REFERENCES units(id),
          tenant_id INTEGER NOT NULL REFERENCES tenants(id),
          start_date TEXT NOT NULL CHECK (length(start_date) = 10 AND start_date GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]'),
          rent_paisa INTEGER NOT NULL CHECK (typeof(rent_paisa) = 'integer' AND rent_paisa BETWEEN 1 AND 9007199254740991),
          due_day INTEGER NOT NULL CHECK (typeof(due_day) = 'integer' AND due_day BETWEEN 1 AND 31),
          notice_months INTEGER NOT NULL CHECK (typeof(notice_months) = 'integer' AND notice_months BETWEEN 0 AND 9007199254740991),
          agreed_advance_paisa INTEGER NOT NULL CHECK (typeof(agreed_advance_paisa) = 'integer' AND agreed_advance_paisa BETWEEN 0 AND 9007199254740991),
          ended_on TEXT CHECK (ended_on IS NULL OR ended_on >= start_date),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL
        );
        CREATE UNIQUE INDEX one_open_tenancy_per_unit ON tenancies(unit_id) WHERE ended_on IS NULL;
        PRAGMA user_version = 8;
      `);
    }
    if (version < 9) {
      await transaction.execAsync(`
        CREATE TABLE bills (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenancy_id INTEGER NOT NULL REFERENCES tenancies(id),
          billing_month TEXT NOT NULL CHECK (length(billing_month)=7 AND billing_month GLOB '[0-9][0-9][0-9][0-9]-[0-9][0-9]' AND substr(billing_month,6,2) BETWEEN '01' AND '12'),
          status TEXT NOT NULL CHECK (status IN ('draft','finalized','void')),
          covered_from TEXT NOT NULL, covered_through TEXT NOT NULL, due_date TEXT NOT NULL,
          source_start_date TEXT NOT NULL, source_due_day INTEGER NOT NULL CHECK (source_due_day BETWEEN 1 AND 31),
          source_signature TEXT NOT NULL, calculation_rule TEXT NOT NULL,
          void_reason TEXT NOT NULL DEFAULT '',
          created_at TEXT NOT NULL, updated_at TEXT NOT NULL, finalized_at TEXT, voided_at TEXT,
          CHECK (covered_through >= covered_from),
          CHECK (status != 'finalized' OR finalized_at IS NOT NULL),
          CHECK (status != 'void' OR (finalized_at IS NOT NULL AND voided_at IS NOT NULL AND length(trim(void_reason)) > 0))
        );
        CREATE UNIQUE INDEX one_current_bill_per_month ON bills(tenancy_id,billing_month) WHERE status IN ('draft','finalized');
        CREATE TABLE bill_lines (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          bill_id INTEGER NOT NULL REFERENCES bills(id) ON DELETE CASCADE,
          kind TEXT NOT NULL CHECK (length(trim(kind)) > 0),
          reference_amount_paisa INTEGER NOT NULL CHECK (typeof(reference_amount_paisa)='integer' AND reference_amount_paisa BETWEEN 0 AND 9007199254740991),
          proposed_paisa INTEGER NOT NULL CHECK (typeof(proposed_paisa)='integer' AND proposed_paisa BETWEEN 0 AND 9007199254740991),
          amount_paisa INTEGER NOT NULL CHECK (typeof(amount_paisa)='integer' AND amount_paisa BETWEEN 0 AND 9007199254740991),
          override_reason TEXT NOT NULL DEFAULT '',
          CHECK (amount_paisa=proposed_paisa OR length(trim(override_reason)) > 0)
        );
        CREATE UNIQUE INDEX one_rent_line_per_bill ON bill_lines(bill_id) WHERE kind='rent';
        PRAGMA user_version=9;
      `);
    }
    if (version < 10) {
      await transaction.execAsync(`
        CREATE TABLE tenancy_charge_versions (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenancy_id INTEGER NOT NULL REFERENCES tenancies(id),
          effective_month TEXT NOT NULL CHECK (effective_month GLOB '[0-9][0-9][0-9][0-9]-[0-1][0-9]' AND substr(effective_month,6,2) BETWEEN '01' AND '12'),
          water_mode TEXT NOT NULL CHECK (water_mode IN ('none','fixed','manual')),
          water_paisa INTEGER NOT NULL CHECK (typeof(water_paisa)='integer' AND water_paisa BETWEEN 0 AND 9007199254740991 AND (water_mode='fixed' OR water_paisa=0)),
          service_mode TEXT NOT NULL CHECK (service_mode IN ('none','fixed')),
          service_paisa INTEGER NOT NULL CHECK (typeof(service_paisa)='integer' AND service_paisa BETWEEN 0 AND 9007199254740991 AND (service_mode='fixed' OR service_paisa=0)),
          gas_mode TEXT NOT NULL CHECK (gas_mode IN ('none','fixed')),
          gas_paisa INTEGER NOT NULL CHECK (typeof(gas_paisa)='integer' AND gas_paisa BETWEEN 0 AND 9007199254740991 AND (gas_mode='fixed' OR gas_paisa=0)),
          created_at TEXT NOT NULL,
          updated_at TEXT NOT NULL,
          UNIQUE (tenancy_id,effective_month)
        );
        ALTER TABLE bills ADD COLUMN charge_signature TEXT NOT NULL DEFAULT '';
        ALTER TABLE bill_lines ADD COLUMN display_name TEXT NOT NULL DEFAULT 'Rent';
        ALTER TABLE bill_lines ADD COLUMN name_key TEXT NOT NULL DEFAULT '';
        ALTER TABLE bill_lines ADD COLUMN position INTEGER NOT NULL DEFAULT 0;
        ALTER TABLE bill_lines ADD COLUMN source_mode TEXT NOT NULL DEFAULT 'rent' CHECK (source_mode IN ('rent','fixed','manual','oneoff'));
        CREATE UNIQUE INDEX one_standard_charge_per_bill ON bill_lines(bill_id,kind) WHERE kind IN ('water','service','gas');
        CREATE UNIQUE INDEX unique_extra_name_per_bill ON bill_lines(bill_id,name_key) WHERE kind='other';
        PRAGMA user_version=10;
      `);
    }
    if (version < 11) {
      await transaction.execAsync(`
        CREATE TABLE payments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          tenancy_id INTEGER NOT NULL REFERENCES tenancies(id),
          operation_id TEXT NOT NULL UNIQUE CHECK (length(operation_id)=32),
          request_signature TEXT NOT NULL,
          amount_paisa INTEGER NOT NULL CHECK (typeof(amount_paisa)='integer' AND amount_paisa BETWEEN 1 AND 9007199254740991),
          remaining_paisa INTEGER NOT NULL CHECK (typeof(remaining_paisa)='integer' AND remaining_paisa BETWEEN 0 AND 9007199254740991),
          received_on TEXT NOT NULL,
          method TEXT NOT NULL CHECK (method IN ('cash','bank','wallet')),
          reference TEXT NOT NULL DEFAULT '', notes TEXT NOT NULL DEFAULT '',
          tenant_name TEXT NOT NULL, property_name TEXT NOT NULL, floor_name TEXT NOT NULL, unit_name TEXT NOT NULL,
          status TEXT NOT NULL CHECK (status IN ('recorded','reversed')),
          recorded_at TEXT NOT NULL,
          reversed_at TEXT, reversal_reason TEXT NOT NULL DEFAULT '',
          CHECK (status!='reversed' OR (reversed_at IS NOT NULL AND length(trim(reversal_reason))>0))
        );
        CREATE INDEX payments_by_tenancy ON payments(tenancy_id,id);
        CREATE TABLE payment_allocations (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          payment_id INTEGER NOT NULL REFERENCES payments(id),
          bill_line_id INTEGER NOT NULL REFERENCES bill_lines(id),
          amount_paisa INTEGER NOT NULL CHECK (typeof(amount_paisa)='integer' AND amount_paisa BETWEEN 1 AND 9007199254740991),
          billing_month TEXT NOT NULL, charge_kind TEXT NOT NULL, charge_name TEXT NOT NULL,
          UNIQUE (payment_id,bill_line_id)
        );
        CREATE INDEX allocations_by_line ON payment_allocations(bill_line_id);
        PRAGMA user_version=11;
      `);
    }
  });
}
