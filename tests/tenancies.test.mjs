import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { connect } from './sqlite.mjs';
import { migrateDatabase } from '../src/platform/database/migrations.ts';
import {
  createProperty,
  listProperties,
} from '../src/features/properties/propertyStore.ts';
import {
  createFloor,
  listFloors,
} from '../src/features/properties/floorStore.ts';
import { createUnit, listUnits } from '../src/features/properties/unitStore.ts';
import { getUnitContext } from '../src/features/properties/unitContext.ts';
import {
  createTenant,
  listTenants,
} from '../src/features/tenants/tenantStore.ts';
import {
  createTenancy,
  correctTenancy,
  getCurrentTenancy,
  listFloorOccupancy,
} from '../src/features/tenancies/tenancyStore.ts';
import {
  calendarDate,
  localDate,
  dateForPicker,
  validateTenancy,
} from '../src/features/tenancies/tenancyValidation.ts';
import {
  parsePaisa,
  paisaInput,
  formatPaisa,
} from '../src/shared/money/paisa.ts';
import {
  readLanguage,
  writeLanguage,
} from '../src/platform/database/languagePreference.ts';

const terms = {
  startDate: '2026-01-15',
  rent: '১০০০০.৫০',
  dueDay: '৩১',
  noticeMonths: '২',
  agreedAdvance: '২০০০০.২৫',
};
const unit = {
  name: 'A',
  sizeSqFt: '',
  bedrooms: '2',
  drawingRooms: '1',
  totalBathrooms: '2',
  attachedBathrooms: '1',
  balconies: '1',
  notes: '',
};
const person = {
  name: 'রহিমা',
  phone: '01712345678',
  address: 'Dhaka',
  idType: '',
  idNumber: '',
  emergencyContact: '',
  notes: '',
};
async function parents(db) {
  const houseId = await createProperty(db, {
    name: 'House',
    location: 'Dhaka',
    address: '',
  });
  const floorId = await createFloor(db, houseId, 'First floor', 'F1');
  const unitId = await createUnit(db, floorId, unit);
  const otherUnitId = await createUnit(db, floorId, { ...unit, name: 'B' });
  const tenantId = await createTenant(db, person);
  return { houseId, floorId, unitId, otherUnitId, tenantId };
}

test('exact paisa parsing accepts both scripts and preserves decimals, zero and safe boundaries', () => {
  assert.equal(parsePaisa('১০০০০.৫০'), 1000050);
  assert.equal(parsePaisa('0'), 0);
  assert.equal(parsePaisa('0001.2'), 120);
  assert.equal(parsePaisa('90071992547409.91'), Number.MAX_SAFE_INTEGER);
  assert.equal(paisaInput(Number.MAX_SAFE_INTEGER), '90071992547409.91');
  assert.equal(formatPaisa(1000050, 'bn'), '৳ ১০,০০০.৫০');
  assert.equal(formatPaisa(1, 'en'), 'BDT 0.01');
  for (const text of [
    '',
    '-1',
    '1.001',
    '1e3',
    'NaN',
    '1.',
    '1,000',
    '90071992547409.92',
  ])
    assert.equal(parsePaisa(text), undefined);
});

test('calendar dates stay local; validation rejects future/invalid terms and accepts explicit zero advance/notice', () => {
  assert.equal(localDate(new Date(2026, 0, 15, 0, 5)), '2026-01-15');
  assert.equal(localDate(dateForPicker('2026-01-15')), '2026-01-15');
  assert.equal(calendarDate('2024-02-29'), true);
  assert.equal(calendarDate('2026-02-29'), false);
  assert.equal(calendarDate('2026-04-31'), false);
  assert.deepEqual(
    validateTenancy(
      { ...terms, noticeMonths: '০', agreedAdvance: '০' },
      '2026-01-15',
    ),
    {},
  );
  const invalid = validateTenancy(
    {
      ...terms,
      startDate: '2026-01-16',
      rent: '0',
      dueDay: '32',
      noticeMonths: '1.5',
      agreedAdvance: '',
    },
    '2026-01-15',
  );
  assert.deepEqual(Object.keys(invalid), [
    'startDate',
    'rent',
    'dueDay',
    'noticeMonths',
    'agreedAdvance',
  ]);
});

test('version 7 upgrade preserves all parents and language, is repeatable and starts with vacant units', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const ids = await parents(c.db);
    await writeLanguage(c.db, 'en');
    await c.db.execAsync('DROP TABLE payment_allocations; DROP TABLE payments; DROP TABLE tenancy_charge_versions; DROP TABLE bill_lines; DROP TABLE bills; DROP TABLE tenancies; PRAGMA user_version=7');
    await migrateDatabase(c.db);
    await migrateDatabase(c.db);
    assert.equal(
      (await c.db.getFirstAsync('PRAGMA user_version')).user_version,
      11,
    );
    assert.equal(await readLanguage(c.db), 'en');
    assert.equal((await listProperties(c.db))[0].id, ids.houseId);
    assert.equal((await listFloors(c.db, ids.houseId))[0].floorCodeName, 'F1');
    assert.equal((await listUnits(c.db, ids.floorId)).length, 2);
    assert.equal((await listTenants(c.db))[0].id, ids.tenantId);
    assert.equal(await getCurrentTenancy(c.db, ids.unitId), undefined);
    assert.deepEqual(await listFloorOccupancy(c.db, ids.floorId), []);
  } finally {
    c.close();
  }
});

test('create/correct/reopen preserves links and exact terms; occupancy is derived from current records', async () => {
  const directory = mkdtempSync(join(tmpdir(), 'hrt-tenancies-'));
  const path = join(directory, 'rent.db');
  let c = connect(path);
  try {
    await migrateDatabase(c.db);
    const ids = await parents(c.db);
    const id = await createTenancy(c.db, ids.unitId, ids.tenantId, terms);
    await correctTenancy(c.db, ids.unitId, id, {
      ...terms,
      rent: '11000.01',
      noticeMonths: '0',
      agreedAdvance: '0',
    });
    c.close();
    c = connect(path);
    const saved = await getCurrentTenancy(c.db, ids.unitId);
    assert.equal(saved.id, id);
    assert.equal(saved.tenantId, ids.tenantId);
    assert.equal(saved.unitId, ids.unitId);
    assert.equal(saved.rentPaisa, 1100001);
    assert.equal(saved.agreedAdvancePaisa, 0);
    assert.equal(saved.noticeMonths, 0);
    assert.equal(saved.dueDay, 31);
    assert.equal(saved.tenantName, person.name);
    assert.deepEqual(await listFloorOccupancy(c.db, ids.floorId), [
      {
        unitId: ids.unitId,
        unitName: 'A',
        tenantId: ids.tenantId,
        tenantName: person.name,
      },
    ]);
    assert.equal(
      (await getUnitContext(c.db, ids.unitId)).property.id,
      ids.houseId,
    );
    assert.equal(await getUnitContext(c.db, -1), undefined);
  } finally {
    c.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test('competing tenancies are rejected per unit; one tenant can rent several units', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const ids = await parents(c.db);
    const otherTenant = await createTenant(c.db, {
      ...person,
      name: 'Another person',
    });
    const results = await Promise.allSettled([
      createTenancy(c.db, ids.unitId, ids.tenantId, terms),
      createTenancy(c.db, ids.unitId, otherTenant, terms),
    ]);
    assert.equal(
      results.filter((result) => result.status === 'fulfilled').length,
      1,
    );
    assert.equal(
      results.filter((result) => result.status === 'rejected').length,
      1,
    );
    const winner = await getCurrentTenancy(c.db, ids.unitId);
    await createTenancy(c.db, ids.otherUnitId, winner.tenantId, terms);
    assert.equal(
      (await getCurrentTenancy(c.db, ids.otherUnitId)).tenantId,
      winner.tenantId,
    );
    assert.equal((await listFloorOccupancy(c.db, ids.floorId)).length, 2);
    // Even direct SQL bypassing the preflight reader cannot create a second open rental.
    await assert.rejects(
      c.db
        .execAsync(`INSERT INTO tenancies (unit_id,tenant_id,start_date,rent_paisa,due_day,notice_months,agreed_advance_paisa,created_at,updated_at)
      SELECT unit_id,tenant_id,start_date,rent_paisa,due_day,notice_months,agreed_advance_paisa,created_at,updated_at FROM tenancies LIMIT 1`),
      /UNIQUE/,
    );
  } finally {
    c.close();
  }
});

test('missing parents, wrong-unit corrections, invalid input and failed writes preserve saved records', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const ids = await parents(c.db);
    await assert.rejects(
      createTenancy(c.db, -1, ids.tenantId, terms),
      (error) => error.reason === 'missing',
    );
    await assert.rejects(
      createTenancy(c.db, ids.unitId, -1, terms),
      (error) => error.reason === 'missing',
    );
    const id = await createTenancy(c.db, ids.unitId, ids.tenantId, terms);
    const before = await getCurrentTenancy(c.db, ids.unitId);
    await assert.rejects(
      correctTenancy(c.db, ids.otherUnitId, id, terms),
      (error) => error.reason === 'missing',
    );
    await assert.rejects(
      correctTenancy(c.db, ids.unitId, id, { ...terms, rent: '0' }),
      (error) => error.reason === 'invalid',
    );
    await c.db.execAsync('PRAGMA query_only=ON');
    await assert.rejects(
      correctTenancy(c.db, ids.unitId, id, { ...terms, rent: '12000' }),
    );
    await assert.rejects(
      createTenancy(c.db, ids.otherUnitId, ids.tenantId, terms),
    );
    assert.deepEqual(await getCurrentTenancy(c.db, ids.unitId), before);
    assert.equal(await getCurrentTenancy(c.db, ids.otherUnitId), undefined);
  } finally {
    c.close();
  }
});
