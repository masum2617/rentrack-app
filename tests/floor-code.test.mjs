import assert from 'node:assert/strict';
import { test } from 'node:test';
import { connect } from './sqlite.mjs';
import { migrateDatabase } from '../src/platform/database/migrations.ts';
import { createProperty } from '../src/features/properties/propertyStore.ts';
import {
  createFloor,
  updateFloor,
  listFloors,
} from '../src/features/properties/floorStore.ts';
import {
  writeLanguage,
  readLanguage,
} from '../src/platform/database/languagePreference.ts';

test('existing v3 floors rebuild with code column while preserving records and locale', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const propertyId = await createProperty(c.db, {
      name: 'House',
      location: 'Dhaka',
      address: '',
    });
    const id = await createFloor(c.db, propertyId, 'Ground');
    await writeLanguage(c.db, 'en');
    await c.db.execAsync(
      'DROP TABLE units; ALTER TABLE floors DROP COLUMN floor_code_name; PRAGMA user_version = 3',
    );
    await migrateDatabase(c.db);
    await updateFloor(c.db, propertyId, id, 'Ground', ' G ');
    const floors = await listFloors(c.db, propertyId);
    assert.equal(floors[0].id, id);
    assert.equal(floors[0].propertyId, propertyId);
    assert.equal(floors[0].floorCodeName, 'G');
    assert.equal(await readLanguage(c.db), 'en');
    await migrateDatabase(c.db);
    assert.equal((await listFloors(c.db, propertyId))[0].floorCodeName, 'G');
  } finally {
    c.close();
  }
});

test('create/read/edit/clear floor codes round-trip and optional calls still work', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const parent = await createProperty(c.db, {
      name: 'House',
      location: 'Dhaka',
      address: '',
    });
    const id = await createFloor(c.db, parent, 'First', ' F1 ');
    assert.equal((await listFloors(c.db, parent))[0].floorCodeName, 'F1');
    await updateFloor(c.db, parent, id, 'First', 'F2');
    assert.equal((await listFloors(c.db, parent))[0].floorCodeName, 'F2');
    await updateFloor(c.db, parent, id, 'First');
    assert.equal((await listFloors(c.db, parent))[0].floorCodeName, '');
    await createFloor(c.db, parent, 'Second');
    assert.equal((await listFloors(c.db, parent))[1].floorCodeName, '');
  } finally {
    c.close();
  }
});

test('v3 databases already containing the experimental column keep its values during rebuild', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const parent = await createProperty(c.db, {
      name: 'House',
      location: 'Dhaka',
      address: '',
    });
    const id = await createFloor(c.db, parent, 'First');
    await c.db.runAsync(
      'UPDATE floors SET floor_code_name = ? WHERE id = ?',
      'F1',
      id,
    );
    const retiredId = await createFloor(c.db, parent, 'Temporary');
    await c.db.runAsync('DELETE FROM floors WHERE id = ?', retiredId);
    await c.db.execAsync('DROP TABLE units; PRAGMA user_version = 3');
    await migrateDatabase(c.db);
    assert.equal((await listFloors(c.db, parent))[0].floorCodeName, 'F1');
    assert.ok(await createFloor(c.db, parent, 'Second') > retiredId);
    await assert.rejects(createFloor(c.db, parent, 'FIRST'), /duplicate/);
    await assert.rejects(createFloor(c.db, 9999, 'Missing'), /FOREIGN KEY/);
  } finally {
    c.close();
  }
});
