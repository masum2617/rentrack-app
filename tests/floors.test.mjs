import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { connect } from './sqlite.mjs';
import { migrateDatabase } from '../src/platform/database/migrations.ts';
import {
  readLanguage,
  writeLanguage,
} from '../src/platform/database/languagePreference.ts';
import {
  createProperty,
  getProperty,
  listPropertySummaries,
} from '../src/features/properties/propertyStore.ts';
import {
  createFloor,
  updateFloor,
  listFloors,
  FloorNameError,
} from '../src/features/properties/floorStore.ts';

const house = { name: 'রহমান বাড়ি', location: 'মিরপুর', address: '' };

test('version 2 upgrade preserves houses, IDs and language, and enables foreign keys', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const id = await createProperty(c.db, house);
    await writeLanguage(c.db, 'en');
    await c.db.execAsync('DROP TABLE payment_allocations; DROP TABLE payments; DROP TABLE tenancy_charge_versions; DROP TABLE bill_lines; DROP TABLE bills; DROP TABLE tenancies; DROP TABLE tenants; DROP TABLE units; DROP TABLE floors; PRAGMA user_version = 2');
    await migrateDatabase(c.db);
    await migrateDatabase(c.db);
    assert.equal(
      (await c.db.getFirstAsync('PRAGMA user_version')).user_version,
      11,
    );
    assert.equal(
      (await c.db.getFirstAsync('PRAGMA foreign_keys')).foreign_keys,
      1,
    );
    assert.equal(await readLanguage(c.db), 'en');
    assert.deepEqual({ ...(await getProperty(c.db, id)) }, { id, ...house });
    assert.deepEqual(await listFloors(c.db, id), []);
  } finally {
    c.close();
  }
});

test('new floors survive reopen; editing preserves identity, parent and creation order', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'hrt-floors-'));
  const path = join(folder, 'records.db');
  let c = connect(path);
  try {
    await migrateDatabase(c.db);
    const parent = await createProperty(c.db, house);
    const first = await createFloor(c.db, parent, ' নিচতলা ');
    const second = await createFloor(c.db, parent, 'প্রথম তলা');
    c.close();
    c = connect(path);
    await migrateDatabase(c.db);
    assert.equal((await listFloors(c.db, parent))[0].name, 'নিচতলা');
    await updateFloor(c.db, parent, first, 'ছাদের তলা');
    c.close();
    c = connect(path);
    await migrateDatabase(c.db);
    const floors = await listFloors(c.db, parent);
    assert.deepEqual(
      floors.map((f) => f.id),
      [first, second],
    );
    assert.equal(floors[0].propertyId, parent);
    assert.equal(floors[0].name, 'ছাদের তলা');
  } finally {
    c.close();
    rmSync(folder, { recursive: true, force: true });
  }
});

test('duplicates normalize case, Unicode and whitespace within a house only', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const a = await createProperty(c.db, house),
      b = await createProperty(c.db, house);
    const id = await createFloor(c.db, a, ' Floor   A ');
    const duplicate = (e) =>
      e instanceof FloorNameError && e.reason === 'duplicate';
    await assert.rejects(createFloor(c.db, a, 'floor\tA'), duplicate);
    await createFloor(c.db, b, 'floor a');
    await updateFloor(c.db, a, id, 'FLOOR A');
    await createFloor(c.db, a, 'Café');
    await assert.rejects(createFloor(c.db, a, 'Cafe\u0301'), duplicate);
    const other = await createFloor(c.db, a, 'Second');
    await assert.rejects(updateFloor(c.db, a, other, 'floor a'), duplicate);
    assert.equal((await listFloors(c.db, a)).length, 3);
  } finally {
    c.close();
  }
});

test('blank names and invalid parents fail; updates cannot cross house boundaries', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const a = await createProperty(c.db, house),
      b = await createProperty(c.db, house);
    await assert.rejects(
      createFloor(c.db, a, ' \n\t '),
      (e) => e instanceof FloorNameError && e.reason === 'required',
    );
    await assert.rejects(createFloor(c.db, 99999, 'Ground'), /FOREIGN KEY/);
    const id = await createFloor(c.db, a, 'Ground');
    await assert.rejects(
      updateFloor(c.db, b, id, 'Changed'),
      /no longer exists/,
    );
    await assert.rejects(
      updateFloor(c.db, a, 99999, 'Changed'),
      /no longer exists/,
    );
    assert.equal((await listFloors(c.db, a))[0].name, 'Ground');
    assert.deepEqual(await listFloors(c.db, b), []);
    assert.equal(await getProperty(c.db, 99999), undefined);
  } finally {
    c.close();
  }
});

test('summary counts remain isolated to their house and renaming does not change counts', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const a = await createProperty(c.db, house),
      b = await createProperty(c.db, house);
    assert.deepEqual(
      (await listPropertySummaries(c.db)).map((p) => p.floorCount),
      [0, 0],
    );
    const id = await createFloor(c.db, a, 'Ground');
    await createFloor(c.db, a, 'First');
    await updateFloor(c.db, a, id, 'Renamed');
    const summaries = await listPropertySummaries(c.db);
    assert.equal(summaries.find((p) => p.id === a).floorCount, 2);
    assert.equal(summaries.find((p) => p.id === b).floorCount, 0);
  } finally {
    c.close();
  }
});

test('rejected writes preserve floors and counts; a subsequent valid retry creates once', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const parent = await createProperty(c.db, house),
      id = await createFloor(c.db, parent, 'Ground');
    await c.db.execAsync('PRAGMA query_only = ON');
    await assert.rejects(createFloor(c.db, parent, 'First'), /readonly/);
    await assert.rejects(updateFloor(c.db, parent, id, 'Changed'), /readonly/);
    assert.equal((await listFloors(c.db, parent))[0].name, 'Ground');
    assert.equal((await listPropertySummaries(c.db))[0].floorCount, 1);
    await c.db.execAsync('PRAGMA query_only = OFF');
    await createFloor(c.db, parent, 'First');
    assert.equal((await listPropertySummaries(c.db))[0].floorCount, 2);
  } finally {
    c.close();
  }
});
