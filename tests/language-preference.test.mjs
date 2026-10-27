import assert from 'node:assert/strict';
import { test } from 'node:test';
import { connect } from './sqlite.mjs';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { migrateDatabase } from '../src/platform/database/migrations.ts';
import {
  readLanguage,
  writeLanguage,
} from '../src/platform/database/languagePreference.ts';

test('first migration defaults to Bangla without inventing a saved choice', async () => {
  const connection = connect();
  try {
    await migrateDatabase(connection.db);
    assert.equal(await readLanguage(connection.db), 'bn');
    assert.equal(
      (await connection.db.getFirstAsync('PRAGMA user_version')).user_version,
      6,
    );
    assert.equal(
      (
        await connection.db.getFirstAsync(
          'SELECT count(*) AS count FROM device_preferences',
        )
      ).count,
      0,
    );
  } finally {
    connection.close();
  }
});

test('English survives closing and reopening a database; migration preserves it', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'hrt-language-'));
  const path = join(folder, 'preferences.db');
  let connection = connect(path);
  try {
    await migrateDatabase(connection.db);
    await writeLanguage(connection.db, 'en');
    connection.close();
    connection = connect(path);
    await migrateDatabase(connection.db);
    assert.equal(await readLanguage(connection.db), 'en');
    await writeLanguage(connection.db, 'bn');
    await writeLanguage(connection.db, 'en');
    assert.equal(
      (
        await connection.db.getFirstAsync(
          'SELECT count(*) AS count FROM device_preferences',
        )
      ).count,
      1,
    );
    assert.equal(await readLanguage(connection.db), 'en');
  } finally {
    connection.close();
    rmSync(folder, { recursive: true, force: true });
  }
});

test('a rejected write preserves the previous language', async () => {
  const connection = connect();
  try {
    await migrateDatabase(connection.db);
    await writeLanguage(connection.db, 'en');
    await connection.db.execAsync('PRAGMA query_only = ON');
    await assert.rejects(writeLanguage(connection.db, 'bn'), /readonly/);
    assert.equal(await readLanguage(connection.db), 'en');
  } finally {
    connection.close();
  }
});

test('database constraints reject unsupported values and additional preference rows', async () => {
  const connection = connect();
  try {
    await migrateDatabase(connection.db);
    await assert.rejects(
      connection.db.runAsync("INSERT INTO device_preferences VALUES (1, 'fr')"),
      /CHECK/,
    );
    await assert.rejects(
      connection.db.runAsync("INSERT INTO device_preferences VALUES (2, 'en')"),
      /CHECK/,
    );
  } finally {
    connection.close();
  }
});

test('a newer schema fails safely without resetting its data or version', async () => {
  const connection = connect();
  try {
    await migrateDatabase(connection.db);
    await writeLanguage(connection.db, 'en');
    await connection.db.execAsync('PRAGMA user_version = 7');
    await assert.rejects(migrateDatabase(connection.db), /newer app/);
    assert.equal(
      (await connection.db.getFirstAsync('PRAGMA user_version')).user_version,
      7,
    );
    assert.equal(await readLanguage(connection.db), 'en');
  } finally {
    connection.close();
  }
});
