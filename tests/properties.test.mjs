import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { connect } from './sqlite.mjs';
import { migrateDatabase } from '../src/platform/database/migrations.ts';
import { readLanguage } from '../src/platform/database/languagePreference.ts';
import {
  createProperty,
  updateProperty,
  listProperties,
  filterProperties,
  validateProperty,
} from '../src/features/properties/propertyStore.ts';

test('upgrades an existing language database without erasing its preference', async () => {
  const connection = connect();
  try {
    await connection.db
      .execAsync(`CREATE TABLE device_preferences (id INTEGER PRIMARY KEY, language TEXT NOT NULL);
      INSERT INTO device_preferences VALUES (1, 'en'); PRAGMA user_version = 1;`);
    await migrateDatabase(connection.db);
    assert.equal(await readLanguage(connection.db), 'en');
    assert.deepEqual(await listProperties(connection.db), []);
    await createProperty(connection.db, {
      name: 'রহমান বাড়ি',
      location: 'মিরপুর, ঢাকা',
      address: '',
    });
    await migrateDatabase(connection.db);
    assert.equal((await listProperties(connection.db)).length, 1);
  } finally {
    connection.close();
  }
});

test('create/edit survives reopening and retains identity, Bangla and optional address', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'hrt-properties-'));
  const path = join(folder, 'houses.db');
  let connection = connect(path);
  try {
    await migrateDatabase(connection.db);
    const id = await createProperty(connection.db, {
      name: ' রহমান বাড়ি ',
      location: ' মিরপুর, ঢাকা ',
      address: " বাড়ি ১২, মালিকের 'ঠিকানা' ",
    });
    const anotherId = await createProperty(connection.db, {
      name: 'রহমান বাড়ি',
      location: 'উত্তরা',
      address: '',
    });
    assert.notEqual(id, anotherId);
    connection.close();
    connection = connect(path);
    await migrateDatabase(connection.db);
    assert.equal(
      (await listProperties(connection.db))[1].address,
      "বাড়ি ১২, মালিকের 'ঠিকানা'",
    );
    await updateProperty(connection.db, id, {
      name: 'শান্তি নিবাস',
      location: 'ধানমন্ডি',
      address: '',
    });
    connection.close();
    connection = connect(path);
    const properties = await listProperties(connection.db);
    assert.equal(properties.length, 2);
    assert.equal(properties[1].id, id);
    assert.equal(properties[1].name, 'শান্তি নিবাস');
    assert.equal(properties[1].address, '');
    assert.equal(properties[0].name, 'রহমান বাড়ি');
  } finally {
    connection.close();
    rmSync(folder, { recursive: true, force: true });
  }
});

test('required fields reject whitespace and failed updates preserve the saved record', async () => {
  const connection = connect();
  try {
    await migrateDatabase(connection.db);
    assert.deepEqual(
      validateProperty({ name: '\n ', location: '\t', address: '' }),
      { name: true, location: true },
    );
    await assert.rejects(
      createProperty(connection.db, {
        name: ' ',
        location: 'Dhaka',
        address: '',
      }),
      /required/,
    );
    assert.deepEqual(await listProperties(connection.db), []);
    const input = { name: 'Original house', location: 'Dhaka', address: '' };
    const id = await createProperty(connection.db, input);
    await connection.db.execAsync('PRAGMA query_only = ON');
    await assert.rejects(
      updateProperty(connection.db, id, { ...input, name: 'Changed' }),
      /readonly/,
    );
    await assert.rejects(createProperty(connection.db, input), /readonly/);
    assert.deepEqual(
      (await listProperties(connection.db)).map((row) => ({ ...row })),
      [{ id, ...input }],
    );
  } finally {
    connection.close();
  }
});

test('editing a missing house reports failure instead of claiming success', async () => {
  const connection = connect();
  try {
    await migrateDatabase(connection.db);
    await assert.rejects(
      updateProperty(connection.db, 999, {
        name: 'Missing',
        location: 'Dhaka',
        address: '',
      }),
      /no longer exists/,
    );
  } finally {
    connection.close();
  }
});

test('searches name, location and address in either script with literal punctuation', () => {
  const properties = [
    { id: 1, name: 'রহমান বাড়ি', location: 'মিরপুর', address: 'Road 12' },
    { id: 2, name: 'Shanti House', location: 'Dhaka', address: '100% Lane' },
  ];
  assert.deepEqual(filterProperties(properties, 'রহমান'), [properties[0]]);
  assert.deepEqual(filterProperties(properties, '  DHAKA '), [properties[1]]);
  assert.deepEqual(filterProperties(properties, 'Road 12'), [properties[0]]);
  assert.deepEqual(filterProperties(properties, '%'), [properties[1]]);
  assert.deepEqual(filterProperties(properties, 'unmatched'), []);
});
