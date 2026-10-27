import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { connect } from './sqlite.mjs';
import { migrateDatabase } from '../src/platform/database/migrations.ts';
import { createProperty, listPropertySummaries } from '../src/features/properties/propertyStore.ts';
import { createFloor, getFloor } from '../src/features/properties/floorStore.ts';
import { readLanguage, writeLanguage } from '../src/platform/database/languagePreference.ts';
import { createUnit, updateUnit, listUnits } from '../src/features/properties/unitStore.ts';
import { validateUnit, UnitValidationError } from '../src/features/properties/unitValidation.ts';

const input = { name: 'ইউনিট ১এ', sizeSqFt: '৫০০.৫', bedrooms: '২', drawingRooms: '১', totalBathrooms: '২', attachedBathrooms: '১', balconies: '১', notes: 'দক্ষিণমুখী বারান্দা' };
async function parents(db) {
  const houseId = await createProperty(db, { name: 'রহমান বাড়ি', location: 'ঢাকা', address: '' });
  const floorId = await createFloor(db, houseId, 'প্রথম তলা', 'F1');
  return { houseId, floorId };
}

test('unit create/edit/reopen keeps parent, all layout fields and Bangla notes', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'hrt-units-')), path = join(folder, 'units.db');
  let c = connect(path);
  try {
    await migrateDatabase(c.db);
    const { floorId } = await parents(c.db);
    const id = await createUnit(c.db, floorId, input);
    c.close(); c = connect(path); await migrateDatabase(c.db);
    assert.deepEqual({ ...(await listUnits(c.db, floorId))[0] }, { id, floorId, name: input.name, sizeSqFt: 500.5, bedrooms: 2, drawingRooms: 1, totalBathrooms: 2, attachedBathrooms: 1, balconies: 1, notes: input.notes });
    await updateUnit(c.db, floorId, id, { ...input, name: 'ইউনিট ১বি', sizeSqFt: '', bedrooms: '3', notes: 'Updated note' });
    c.close(); c = connect(path); await migrateDatabase(c.db);
    const saved = (await listUnits(c.db, floorId))[0];
    assert.equal(saved.id, id); assert.equal(saved.floorId, floorId); assert.equal(saved.sizeSqFt, undefined); assert.equal(saved.bedrooms, 3); assert.equal(saved.notes, 'Updated note');
    assert.equal((await listUnits(c.db, floorId)).length, 1);
  } finally { c.close(); rmSync(folder, { recursive: true, force: true }); }
});

test('size may be unknown; supplied size must be positive and counts whole/nonnegative', () => {
  assert.deepEqual(validateUnit({ ...input, sizeSqFt: '' }), {});
  assert.equal(validateUnit({ ...input, name: ' \n' }).name, 'required');
  for (const size of ['0', '-2', 'abc', 'Infinity', '1e3', '৫০০x']) assert.equal(validateUnit({ ...input, sizeSqFt: size }).sizeSqFt, 'positiveSize');
  for (const count of ['-1', '1.5', '', 'NaN', '9007199254740992']) assert.equal(validateUnit({ ...input, bedrooms: count }).bedrooms, 'wholeCount');
  assert.equal(validateUnit({ ...input, totalBathrooms: '১', attachedBathrooms: '২' }).attachedBathrooms, 'attachedTotal');
  assert.deepEqual(validateUnit({ ...input, sizeSqFt: '', bedrooms: '0', drawingRooms: '0', totalBathrooms: '0', attachedBathrooms: '0', balconies: '0' }), {});
});

test('unit names are normalized and unique per floor, not across all floors', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db); const { houseId, floorId } = await parents(c.db);
    const secondFloor = await createFloor(c.db, houseId, 'Second');
    const id = await createUnit(c.db, floorId, { ...input, name: ' Unit  A ' });
    const duplicate = (e) => e instanceof UnitValidationError && e.fields.name === 'duplicate';
    await assert.rejects(createUnit(c.db, floorId, { ...input, name: 'unit\t a' }), duplicate);
    await createUnit(c.db, secondFloor, { ...input, name: 'unit a' });
    await updateUnit(c.db, floorId, id, { ...input, name: 'UNIT A' });
    const other = await createUnit(c.db, floorId, { ...input, name: 'Other' });
    await assert.rejects(updateUnit(c.db, floorId, other, { ...input, name: 'unit a' }), duplicate);
  } finally { c.close(); }
});

test('invalid parent, wrong-floor update and invalid bathroom counts cannot corrupt units', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db); const { houseId, floorId } = await parents(c.db);
    const other = await createFloor(c.db, houseId, 'Other');
    await assert.rejects(createUnit(c.db, 99999, input), /FOREIGN KEY/);
    await assert.rejects(createUnit(c.db, floorId, { ...input, attachedBathrooms: '3' }), UnitValidationError);
    const id = await createUnit(c.db, floorId, input);
    await assert.rejects(updateUnit(c.db, other, id, { ...input, name: 'Wrong parent' }), /no longer exists/);
    await assert.rejects(c.db.runAsync('UPDATE units SET attached_bathrooms = 3 WHERE id = ?', id), /CHECK/);
    await assert.rejects(c.db.runAsync('UPDATE units SET bedrooms = 1.5 WHERE id = ?', id), /CHECK/);
    assert.equal((await listUnits(c.db, floorId))[0].name, input.name);
    assert.equal(await getFloor(c.db, 99999, floorId), undefined);
  } finally { c.close(); }
});

test('real house unit totals include all floors without double-counting or mixing houses', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db); const a = await parents(c.db), b = await parents(c.db);
    const extra = await createFloor(c.db, a.houseId, 'Second');
    await createUnit(c.db, a.floorId, input); await createUnit(c.db, extra, input);
    const summaries = await listPropertySummaries(c.db);
    assert.equal(summaries.find((h) => h.id === a.houseId).unitCount, 2);
    assert.equal(summaries.find((h) => h.id === a.houseId).floorCount, 2);
    assert.equal(summaries.find((h) => h.id === b.houseId).unitCount, 0);
  } finally { c.close(); }
});

test('v4 upgrade preserves houses, floor codes, language and starts with no units', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db); const { houseId, floorId } = await parents(c.db);
    await writeLanguage(c.db, 'en'); await c.db.execAsync('DROP TABLE units; PRAGMA user_version = 4');
    await migrateDatabase(c.db);
    assert.equal(await readLanguage(c.db), 'en'); assert.equal((await getFloor(c.db, houseId, floorId)).floorCodeName, 'F1');
    assert.deepEqual(await listUnits(c.db, floorId), []);
    await createUnit(c.db, floorId, { ...input, sizeSqFt: '' });
    assert.equal((await listUnits(c.db, floorId))[0].sizeSqFt, undefined);
  } finally { c.close(); }
});

test('v5 forward upgrade keeps existing unit records and accepts unknown sizes', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db); const { floorId } = await parents(c.db);
    const id = await createUnit(c.db, floorId, input);
    // A real older NOT NULL size table, with the original column order.
    await c.db.execAsync(`CREATE TABLE units_old (
      id INTEGER PRIMARY KEY AUTOINCREMENT, floor_id INTEGER NOT NULL REFERENCES floors(id),
      name TEXT NOT NULL, name_key TEXT NOT NULL, size_sq_ft REAL NOT NULL,
      bedrooms INTEGER NOT NULL, drawing_rooms INTEGER NOT NULL, total_bathrooms INTEGER NOT NULL,
      attached_bathrooms INTEGER NOT NULL, balconies INTEGER NOT NULL, notes TEXT NOT NULL,
      created_at TEXT NOT NULL, updated_at TEXT NOT NULL, UNIQUE(floor_id,name_key));
      INSERT INTO units_old SELECT * FROM units; DROP TABLE units; ALTER TABLE units_old RENAME TO units; PRAGMA user_version = 5;`);
    await migrateDatabase(c.db);
    assert.equal((await listUnits(c.db, floorId))[0].id, id); assert.equal((await listUnits(c.db, floorId))[0].sizeSqFt, 500.5);
    await updateUnit(c.db, floorId, id, { ...input, sizeSqFt: '' });
    assert.equal((await listUnits(c.db, floorId))[0].sizeSqFt, undefined);
  } finally { c.close(); }
});

test('read-only failures preserve units and totals, then retry succeeds once', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db); const { floorId } = await parents(c.db);
    const id = await createUnit(c.db, floorId, input);
    await c.db.execAsync('PRAGMA query_only = ON');
    await assert.rejects(updateUnit(c.db, floorId, id, { ...input, name: 'Changed' }), /readonly/);
    await assert.rejects(createUnit(c.db, floorId, { ...input, name: 'Second' }), /readonly/);
    assert.equal((await listUnits(c.db, floorId))[0].name, input.name);
    await c.db.execAsync('PRAGMA query_only = OFF'); await createUnit(c.db, floorId, { ...input, name: 'Second' });
    assert.equal((await listUnits(c.db, floorId)).length, 2);
    assert.equal((await listPropertySummaries(c.db))[0].unitCount, 2);
  } finally { c.close(); }
});
