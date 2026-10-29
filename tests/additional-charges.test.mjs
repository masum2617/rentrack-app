// Authored regression cases. Execution remains pending owner authorization.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { connect } from './sqlite.mjs';
import { migrateDatabase } from '../src/platform/database/migrations.ts';
import {
  writeLanguage,
  readLanguage,
} from '../src/platform/database/languagePreference.ts';
import { createProperty } from '../src/features/properties/propertyStore.ts';
import { createFloor } from '../src/features/properties/floorStore.ts';
import { createUnit } from '../src/features/properties/unitStore.ts';
import { createTenant } from '../src/features/tenants/tenantStore.ts';
import {
  createTenancy,
  correctTenancy,
  getCurrentTenancy,
} from '../src/features/tenancies/tenancyStore.ts';
import {
  emptyChargeInput,
  parseChargeSettings,
  saveChargeVersion,
  listChargeVersions,
  applicableCharges,
  chargeSignature,
} from '../src/features/tenancies/chargeSettings.ts';
import {
  initialExtras,
  prepareExtras,
  savedExtras,
} from '../src/features/ledger/additionalCharges.ts';
import {
  getBill,
  getBillingTenancy,
  saveDraft,
  finalizeBill,
  voidBill,
  listBills,
  outstandingPaisa,
  tenancyBillSummary,
} from '../src/features/ledger/billStore.ts';
import {
  sourceSignature,
  proposeBill,
} from '../src/features/ledger/billCalculations.ts';
import { paisaInput } from '../src/shared/money/paisa.ts';

const terms = {
  startDate: '2026-01-16',
  rent: '31000.25',
  dueDay: '10',
  noticeMonths: '0',
  agreedAdvance: '0',
};
const unit = {
  name: 'A1',
  sizeSqFt: '',
  bedrooms: '1',
  drawingRooms: '0',
  totalBathrooms: '1',
  attachedBathrooms: '0',
  balconies: '0',
  notes: '',
};
function settings(waterMode = 'fixed', service = '500.25') {
  return {
    water: { mode: waterMode, amount: waterMode === 'fixed' ? '৩০০.৫০' : '' },
    service: { mode: 'fixed', amount: service },
    gas: { mode: 'fixed', amount: '1000' },
  };
}
async function fixture(db, charges) {
  await migrateDatabase(db);
  const propertyId = await createProperty(db, {
    name: 'House',
    location: 'Dhaka',
    address: '',
  });
  const floorId = await createFloor(db, propertyId, 'Ground', 'G');
  const unitId = await createUnit(db, floorId, unit);
  const tenantId = await createTenant(db, {
    name: 'রহিমা',
    phone: '',
    address: '',
    idType: '',
    idNumber: '',
    emergencyContact: '',
    notes: '',
  });
  const tenancyId = await createTenancy(db, unitId, tenantId, terms, charges);
  return { tenancyId, tenantId, unitId, floorId, propertyId };
}
async function draft(db, tenancyId, month, edit = {}) {
  const source = await getBillingTenancy(db, tenancyId);
  const version = applicableCharges(
    await listChargeVersions(db, tenancyId),
    month,
  );
  return saveDraft(db, {
    tenancyId,
    month,
    amount: paisaInput(proposeBill(source, month).proposedPaisa),
    reason: '',
    expectedSource: sourceSignature(source),
    expectedCharges: chargeSignature(version),
    extras: initialExtras(version),
    ...edit,
  });
}

test('settings and extras validate digits, precision, manual zero, reasons and distinct normalized custom names', () => {
  assert.equal(parseChargeSettings(settings()).water.amountPaisa, 30050);
  assert.throws(() => parseChargeSettings(settings('fixed', '1.234')));
  assert.throws(() =>
    parseChargeSettings({ ...settings(), gas: { mode: 'manual', amount: '' } }),
  );
  const version = {
    id: 1,
    tenancyId: 1,
    effectiveMonth: '2026-01',
    settings: parseChargeSettings(settings('manual')),
  };
  const input = initialExtras(version);
  assert.throws(
    () => prepareExtras(input, version),
    (error) => error.field === 'amount',
  );
  input[0].amount = '০';
  input[1].amount = '450.25';
  assert.throws(
    () => prepareExtras(input, version),
    (error) => error.field === 'reason',
  );
  input[1].reason = 'Agreed reduction';
  const lines = prepareExtras(input, version);
  assert.equal(lines[0].sourceMode, 'manual');
  assert.equal(lines[0].amountPaisa, 0);
  assert.equal(lines[1].proposedPaisa, 50025);
  assert.equal(lines[1].amountPaisa, 45025);
  const extra = {
    key: 'x',
    kind: 'other',
    name: ' Cleaning  Fee ',
    amount: '10',
    reason: '',
  };
  assert.throws(
    () =>
      prepareExtras(
        [...input, extra, { ...extra, key: 'y', name: 'cleaning fee' }],
        version,
      ),
    (error) => error.field === 'name',
  );
  assert.throws(() =>
    prepareExtras([{ ...extra, amount: '90071992547409.92' }]),
  );
  assert.throws(() =>
    prepareExtras([
      { ...extra, amount: '90071992547409.91' },
      { ...extra, key: 'y', name: 'Other', amount: '0.01' },
    ]),
  );
});

test('initial charge settings and tenancy creation commit or roll back together', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db, settings());
    assert.equal(
      (await listChargeVersions(c.db, f.tenancyId))[0].effectiveMonth,
      '2026-01',
    );
    const second = await createUnit(c.db, f.floorId, { ...unit, name: 'A2' });
    await assert.rejects(
      createTenancy(c.db, second, f.tenantId, terms, settings('fixed', 'bad')),
    );
    assert.equal(await getCurrentTenancy(c.db, second), undefined);
    await c.db.execAsync(
      "CREATE TRIGGER fail_initial_settings BEFORE INSERT ON tenancy_charge_versions BEGIN SELECT RAISE(ABORT,'injected'); END",
    );
    await assert.rejects(
      createTenancy(c.db, second, f.tenantId, terms, settings()),
    );
    assert.equal(await getCurrentTenancy(c.db, second), undefined);
  } finally {
    c.close();
  }
});

test('v9 upgrade retains every old bill ID, line ID, amount, status, timestamp and locale', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    await writeLanguage(c.db, 'en');
    const draftId = await draft(c.db, f.tenancyId, '2026-01');
    const finalId = await draft(c.db, f.tenancyId, '2026-02');
    await finalizeBill(c.db, finalId);
    const voidId = await draft(c.db, f.tenancyId, '2026-03');
    await finalizeBill(c.db, voidId);
    await voidBill(c.db, voidId, 'Correction');
    const beforeBills = await c.db.getAllAsync(
      'SELECT * FROM bills ORDER BY id',
    );
    const beforeLines = await c.db.getAllAsync(
      'SELECT * FROM bill_lines ORDER BY id',
    );
    await c.db
      .execAsync(`DROP TABLE payment_allocations; DROP TABLE payments; DROP TABLE tenancy_charge_versions; DROP INDEX one_standard_charge_per_bill; DROP INDEX unique_extra_name_per_bill;
      ALTER TABLE bills DROP COLUMN charge_signature;
      ALTER TABLE bill_lines DROP COLUMN display_name; ALTER TABLE bill_lines DROP COLUMN name_key;
      ALTER TABLE bill_lines DROP COLUMN position; ALTER TABLE bill_lines DROP COLUMN source_mode; PRAGMA user_version=9;`);
    await migrateDatabase(c.db);
    assert.equal(
      (await c.db.getFirstAsync('PRAGMA user_version')).user_version,
      11,
    );
    assert.equal(await readLanguage(c.db), 'en');
    const afterBills = await c.db.getAllAsync(
      'SELECT * FROM bills ORDER BY id',
    );
    const afterLines = await c.db.getAllAsync(
      'SELECT * FROM bill_lines ORDER BY id',
    );
    assert.deepEqual(afterBills, beforeBills);
    assert.deepEqual(afterLines, beforeLines);
    assert.equal((await getBill(c.db, draftId)).status, 'draft');
    assert.equal((await getBill(c.db, finalId)).status, 'finalized');
    assert.equal((await getBill(c.db, voidId)).status, 'void');
    await finalizeBill(c.db, draftId);
  } finally {
    c.close();
  }
});

test('effective versions resolve boundaries, future schedules and none before the first version', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    await saveChargeVersion(c.db, f.tenancyId, '2026-02', settings());
    await saveChargeVersion(c.db, f.tenancyId, '2026-04', settings('manual'));
    await saveChargeVersion(c.db, f.tenancyId, '2027-01', emptyChargeInput());
    const versions = await listChargeVersions(c.db, f.tenancyId);
    assert.equal(applicableCharges(versions, '2026-01'), undefined);
    assert.equal(
      applicableCharges(versions, '2026-03').settings.water.mode,
      'fixed',
    );
    assert.equal(
      applicableCharges(versions, '2026-04').settings.water.mode,
      'manual',
    );
    assert.equal(
      applicableCharges(versions, '2027-01').settings.water.mode,
      'none',
    );
    await assert.rejects(
      saveChargeVersion(c.db, f.tenancyId, '2026-04', settings()),
      (error) => error.code === 'duplicate',
    );
    await assert.rejects(
      saveChargeVersion(c.db, f.tenancyId, '2025-12', settings()),
      (error) => error.code === 'invalid',
    );
    await assert.rejects(
      saveChargeVersion(c.db, 99999, '2026-01', settings()),
      (error) => error.code === 'missing',
    );
  } finally {
    c.close();
  }
});

test('a finalized bill blocks only the changed interval; voiding unlocks and preserves snapshots', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db, settings());
    await saveChargeVersion(
      c.db,
      f.tenancyId,
      '2026-04',
      settings('none', '600'),
    );
    const april = await draft(c.db, f.tenancyId, '2026-04');
    await finalizeBill(c.db, april);
    const januaryVersion = (await listChargeVersions(c.db, f.tenancyId))[0];
    await saveChargeVersion(
      c.db,
      f.tenancyId,
      '2026-01',
      settings('none', '550'),
      januaryVersion.id,
    );
    const march = await draft(c.db, f.tenancyId, '2026-03');
    await finalizeBill(c.db, march);
    const snapshot = await getBill(c.db, march);
    await assert.rejects(
      saveChargeVersion(c.db, f.tenancyId, '2026-02', settings()),
      (error) => error.code === 'locked' && error.month === '2026-03',
    );
    const before = await listChargeVersions(c.db, f.tenancyId);
    await assert.rejects(
      saveChargeVersion(
        c.db,
        f.tenancyId,
        '2026-01',
        settings(),
        januaryVersion.id,
      ),
    );
    assert.deepEqual(await listChargeVersions(c.db, f.tenancyId), before);
    await voidBill(c.db, march, 'Wrong settings');
    await saveChargeVersion(c.db, f.tenancyId, '2026-02', settings());
    const preserved = await getBill(c.db, march);
    assert.deepEqual(preserved.lines, snapshot.lines);
    assert.equal(preserved.finalizedAt, snapshot.finalizedAt);
    assert.equal((await getBill(c.db, april)).status, 'finalized');
  } finally {
    c.close();
  }
});

test('stale drafts retain saved charge snapshots until refreshed and reviewed', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db, settings());
    const id = await draft(c.db, f.tenancyId, '2026-02');
    const saved = await getBill(c.db, id);
    const version = (await listChargeVersions(c.db, f.tenancyId))[0];
    await saveChargeVersion(
      c.db,
      f.tenancyId,
      '2026-01',
      settings('fixed', '700'),
      version.id,
    );
    await assert.rejects(
      finalizeBill(c.db, id),
      (error) => error.code === 'termsChanged',
    );
    assert.deepEqual((await getBill(c.db, id)).lines, saved.lines);
    const source = await getBillingTenancy(c.db, f.tenancyId);
    await assert.rejects(
      saveDraft(c.db, {
        tenancyId: f.tenancyId,
        billId: id,
        month: saved.month,
        amount: paisaInput(saved.rentAmountPaisa),
        reason: '',
        expectedSource: sourceSignature(source),
        expectedCharges: saved.chargeSignature,
        extras: savedExtras(saved.lines),
      }),
      (error) => error.code === 'termsChanged',
    );
    await draft(c.db, f.tenancyId, '2026-02', { billId: id });
    await finalizeBill(c.db, id);
    assert.equal(
      (await getBill(c.db, id)).lines.find((line) => line.kind === 'service')
        .amountPaisa,
      70000,
    );
  } finally {
    c.close();
  }
});

test('manual water, custom extras and overrides persist with totals; removed extras disappear atomically', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'charges-'));
  const path = join(folder, 'app.db');
  let c = connect(path);
  try {
    const f = await fixture(c.db, settings('manual'));
    const version = applicableCharges(
      await listChargeVersions(c.db, f.tenancyId),
      '2026-02',
    );
    const input = initialExtras(version);
    input[0].amount = '১২৫.৫০';
    input[1].amount = '450.25';
    input[1].reason = 'Agreed';
    input.push({
      key: 'extra',
      kind: 'other',
      name: 'Cleaning',
      amount: '100',
      reason: '',
    });
    const id = await draft(c.db, f.tenancyId, '2026-02', { extras: input });
    c.close();
    c = connect(path);
    await migrateDatabase(c.db);
    let bill = await getBill(c.db, id);
    assert.equal(bill.rentAmountPaisa, 3100025);
    assert.equal(bill.amountPaisa, 3267600);
    assert.equal(bill.lines.length, 5);
    assert.equal(outstandingPaisa(await listBills(c.db)), 0);
    await draft(c.db, f.tenancyId, '2026-02', {
      billId: id,
      extras: input.filter((entry) => entry.kind !== 'other'),
    });
    bill = await getBill(c.db, id);
    assert.equal(bill.lines.length, 4);
    await finalizeBill(c.db, id);
    await finalizeBill(c.db, id);
    assert.equal(
      (await tenancyBillSummary(c.db, f.tenancyId)).outstandingPaisa,
      bill.amountPaisa,
    );
    assert.equal(outstandingPaisa(await listBills(c.db)), bill.amountPaisa);
    await assert.rejects(
      draft(c.db, f.tenancyId, '2026-02', { extras: input }),
      (error) => error.code === 'duplicate',
    );
    await voidBill(c.db, id, 'Reissue');
    assert.equal(outstandingPaisa(await listBills(c.db)), 0);
    const replacement = await draft(c.db, f.tenancyId, '2026-02', {
      extras: input,
    });
    assert.notEqual(replacement, id);
    assert.equal((await getBill(c.db, replacement)).status, 'draft');
  } finally {
    c.close();
    rmSync(folder, { recursive: true, force: true });
  }
});

test('all-line total overflow and failed line writes leave prior draft unchanged', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    const id = await draft(c.db, f.tenancyId, '2026-02');
    const before = await getBill(c.db, id);
    await assert.rejects(
      draft(c.db, f.tenancyId, '2026-02', {
        billId: id,
        extras: [
          {
            key: 'x',
            kind: 'other',
            name: 'Oversize',
            amount: '90071992547409.91',
            reason: '',
          },
        ],
      }),
      (error) => error.code === 'range',
    );
    assert.deepEqual(await getBill(c.db, id), before);
    await c.db.execAsync(
      "CREATE TRIGGER fail_extra BEFORE INSERT ON bill_lines WHEN NEW.kind='other' BEGIN SELECT RAISE(ABORT,'injected'); END",
    );
    await assert.rejects(
      draft(c.db, f.tenancyId, '2026-03', {
        billId: id,
        extras: [
          {
            key: 'x',
            kind: 'other',
            name: 'Cleaning',
            amount: '10',
            reason: '',
          },
        ],
      }),
    );
    assert.deepEqual(await getBill(c.db, id), before);
  } finally {
    c.close();
  }
});

test('settings for another tenancy cannot change a draft source or dues', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db, settings());
    const secondUnit = await createUnit(c.db, f.floorId, {
      ...unit,
      name: 'A2',
    });
    const second = await createTenancy(c.db, secondUnit, f.tenantId, terms);
    const id = await draft(c.db, f.tenancyId, '2026-02');
    await saveChargeVersion(c.db, second, '2026-01', settings('manual'));
    await finalizeBill(c.db, id);
    assert.equal((await tenancyBillSummary(c.db, second)).outstandingPaisa, 0);
  } finally {
    c.close();
  }
});

test('a start-month correction does not rewrite an earlier saved draft or its one-offs', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    const id = await draft(c.db, f.tenancyId, '2026-02', {
      extras: [
        {
          key: 'x',
          kind: 'other',
          name: 'Cleaning',
          amount: '150',
          reason: '',
        },
      ],
    });
    const before = await getBill(c.db, id);
    await correctTenancy(c.db, f.unitId, f.tenancyId, {
      ...terms,
      startDate: '2026-03-01',
    });
    assert.deepEqual(await getBill(c.db, id), before);
    const source = await getBillingTenancy(c.db, f.tenancyId);
    await assert.rejects(
      saveDraft(c.db, {
        tenancyId: f.tenancyId,
        billId: id,
        month: before.month,
        amount: paisaInput(before.rentAmountPaisa),
        reason: before.overrideReason,
        expectedSource: sourceSignature(source),
        expectedCharges: before.chargeSignature,
        extras: savedExtras(before.lines),
      }),
      (error) => error.code === 'month',
    );
    assert.deepEqual(await getBill(c.db, id), before);
    // Native acceptance separately verifies cancellation and confirmation before resetting this draft.
  } finally {
    c.close();
  }
});
