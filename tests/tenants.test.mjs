import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { connect } from './sqlite.mjs';
import { migrateDatabase } from '../src/platform/database/migrations.ts';
import {
  createTenant,
  updateTenant,
  listTenants,
  filterTenants,
} from '../src/features/tenants/tenantStore.ts';
import {
  writeLanguage,
  readLanguage,
} from '../src/platform/database/languagePreference.ts';

const person = {
  name: ' রহিমা বেগম ',
  phone: ' ০১৭১২৩৪৫৬৭৮ ',
  address: ' মিরপুর ',
  idType: '',
  idNumber: '',
  emergencyContact: '',
  notes: '',
};

test('tenant create/edit survives reopening; optional fields and independent identities are preserved', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'hrt-tenants-'));
  const path = join(directory, 'tenants.db');
  let c = connect(path);
  try {
    await migrateDatabase(c.db);
    const first = await createTenant(c.db, person);
    const second = await createTenant(c.db, person);
    assert.notEqual(first, second);
    await updateTenant(c.db, first, {
      ...person,
      name: 'রহিমা খাতুন',
      idType: 'NID',
      idNumber: '001234',
      emergencyContact: "Sister's number",
      notes: ' দক্ষিণমুখী ইউনিট পছন্দ ',
    });
    c.close();
    c = connect(path);
    const tenants = await listTenants(c.db);
    assert.equal(tenants[1].id, first);
    assert.equal(tenants[1].name, 'রহিমা খাতুন');
    assert.equal(tenants[1].idNumber, '001234');
    assert.equal(tenants[1].emergencyContact, "Sister's number");
    assert.equal(tenants[1].notes, 'দক্ষিণমুখী ইউনিট পছন্দ');
    assert.equal(tenants[0].name, 'রহিমা বেগম');
    const id = await createTenant(c.db, {
      name: 'Only name',
      phone: '',
      address: '',
      idType: '',
      idNumber: '',
      emergencyContact: '',
      notes: '',
    });
    assert.equal((await listTenants(c.db))[0].id, id);
  } finally {
    c.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('tenant rejects blank names and missing updates; read-only writes retain existing data', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    await assert.rejects(
      createTenant(c.db, { ...person, name: '  ' }),
      /name is required/,
    );
    const id = await createTenant(c.db, person);
    await assert.rejects(
      updateTenant(c.db, id, { ...person, name: '\n\t' }),
      /name is required/,
    );
    await assert.rejects(
      updateTenant(c.db, id + 999, person),
      /no longer exists/,
    );
    await c.db.execAsync('PRAGMA query_only = ON');
    await assert.rejects(
      updateTenant(c.db, id, { ...person, name: 'Changed' }),
    );
    await assert.rejects(createTenant(c.db, person));
    assert.equal((await listTenants(c.db))[0].name, 'রহিমা বেগম');
    assert.equal((await listTenants(c.db)).length, 1);
  } finally {
    c.close();
  }
});

test('tenant search handles either phone digit script, name and address; excludes private ID fields', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    await createTenant(c.db, { ...person, phone: '০১৭১২ ৩৪৫-৬৭৮', idNumber: 'private-id' });
    const people = await listTenants(c.db);
    for (const query of ['রহিমা', '01712', '০১৭১২', '01712345678', 'মিরপুর', ''])
      assert.equal(filterTenants(people, query).length, 1);
    assert.equal(filterTenants(people, 'private-id').length, 0);
    assert.equal(filterTenants(people, 'missing').length, 0);
  } finally {
    c.close();
  }
});

test('version 6 upgrade preserves language, house, floor, unit and stable parent IDs', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    await writeLanguage(c.db, 'en');
    await c.db
      .execAsync(`INSERT INTO properties (id,name,location,address,created_at,updated_at) VALUES (1,'House','Dhaka','','now','now');
      INSERT INTO floors (id,property_id,name,name_key,floor_code_name,created_at,updated_at) VALUES (1,1,'First','first','F1','now','now');
      INSERT INTO units (id,floor_id,name,name_key,size_sq_ft,bedrooms,drawing_rooms,total_bathrooms,attached_bathrooms,balconies,notes,created_at,updated_at)
      VALUES (1,1,'A','a',NULL,0,0,0,0,0,'','now','now'); DROP TABLE payment_allocations; DROP TABLE payments; DROP TABLE tenancy_charge_versions; DROP TABLE bill_lines; DROP TABLE bills; DROP TABLE tenancies; DROP TABLE tenants; PRAGMA user_version=6;`);
    await migrateDatabase(c.db);
    await migrateDatabase(c.db);
    assert.equal(
      (await c.db.getFirstAsync('PRAGMA user_version')).user_version,
      11,
    );
    assert.equal(await readLanguage(c.db), 'en');
    assert.equal(
      (
        await c.db.getFirstAsync(
          'SELECT floor_code_name FROM floors WHERE id=1',
        )
      ).floor_code_name,
      'F1',
    );
    assert.equal(
      (await c.db.getFirstAsync('SELECT floor_id FROM units WHERE id=1'))
        .floor_id,
      1,
    );
    assert.deepEqual(await listTenants(c.db), []);
  } finally {
    c.close();
  }
});
