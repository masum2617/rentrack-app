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
import {
  createTenant,
  listTenants,
} from '../src/features/tenants/tenantStore.ts';
import {
  createTenancy,
  correctTenancy,
  getCurrentTenancy,
} from '../src/features/tenancies/tenancyStore.ts';
import {
  proposeBill,
  reviewedAmount,
  sourceSignature,
  safeTotal,
  overdue,
} from '../src/features/ledger/billCalculations.ts';
import {
  getBill,
  getBillingTenancy,
  saveDraft,
  finalizeBill,
  voidBill,
  discardDraft,
  listBills,
  outstandingPaisa,
  tenancyBillSummary,
} from '../src/features/ledger/billStore.ts';
import { hasFinalizedBills } from '../src/features/ledger/billingGuards.ts';
import {
  writeLanguage,
  readLanguage,
} from '../src/platform/database/languagePreference.ts';
import { paisaInput } from '../src/shared/money/paisa.ts';
import { runWriteTransaction } from '../src/platform/database/transactions.ts';

const terms = {
  startDate: '2026-01-16',
  rent: '31000',
  dueDay: '10',
  noticeMonths: '2',
  agreedAdvance: '62000',
};
async function fixture(db) {
  await migrateDatabase(db);
  const houseId = await createProperty(db, {
    name: 'House',
    location: 'Dhaka',
    address: '',
  });
  const floorId = await createFloor(db, houseId, 'First', 'F1');
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
  const unitId = await createUnit(db, floorId, unit),
    otherUnit = await createUnit(db, floorId, { ...unit, name: 'A2' });
  const tenantId = await createTenant(db, {
    name: 'রহিমা',
    phone: '',
    address: '',
    idType: '',
    idNumber: '',
    emergencyContact: '',
    notes: '',
  });
  const tenancyId = await createTenancy(db, unitId, tenantId, terms),
    otherTenancy = await createTenancy(db, otherUnit, tenantId, {
      ...terms,
      rent: '5000',
    });
  return { houseId, floorId, unitId, tenantId, tenancyId, otherTenancy };
}
async function draft(db, tenancyId, month = '2026-01', overrides = {}) {
  const source = await getBillingTenancy(db, tenancyId),
    proposal = proposeBill(source, month);
  return saveDraft(db, {
    tenancyId,
    month,
    amount: paisaInput(proposal.proposedPaisa),
    reason: '',
    expectedSource: sourceSignature(source),
    ...overrides,
  });
}

test('calendar proposals cover inclusive days, whole-taka half-up proration and normal due dates', () => {
  const source = {
    startDate: '2026-10-16',
    rentPaisa: 3100000,
    dueDay: 10,
    noticeMonths: 2,
    agreedAdvancePaisa: 0,
  };
  const october = proposeBill(source, '2026-10', '2026-10-28');
  assert.equal(october.coveredFrom, '2026-10-16');
  assert.equal(october.coveredThrough, '2026-10-31');
  assert.equal(october.proposedPaisa, 1600000);
  assert.equal(october.dueDate, '2026-10-10');
  assert.equal(
    proposeBill(
      { ...source, startDate: '2026-04-16', rentPaisa: 100 },
      '2026-04',
      '2026-05-01',
    ).proposedPaisa,
    100,
  );
  assert.equal(
    proposeBill(
      { ...source, startDate: '2026-04-16', rentPaisa: 99 },
      '2026-04',
      '2026-05-01',
    ).proposedPaisa,
    0,
  );
  const leap = proposeBill(
    { ...source, startDate: '2024-02-29', rentPaisa: 290000, dueDay: 31 },
    '2024-02',
    '2026-10-28',
  );
  assert.equal(leap.proposedPaisa, 10000);
  assert.equal(leap.dueDate, '2024-02-29');
  assert.equal(
    proposeBill(
      { ...source, startDate: '2026-01-01', rentPaisa: 1000050, dueDay: 31 },
      '2026-02',
      '2026-10-28',
    ).proposedPaisa,
    1000050,
  );
  assert.equal(
    proposeBill(
      { ...source, startDate: '2026-01-01', dueDay: 31 },
      '2026-02',
      '2026-10-28',
    ).dueDate,
    '2026-02-28',
  );
  for (const month of ['2026-09', '2026-11', '2026-00', '2026-13', '2026-1'])
    assert.throws(
      () => proposeBill(source, month, '2026-10-28'),
      (e) => e.code === 'month',
    );
  assert.equal(reviewedAmount('০', 'owner reviewed', october.proposedPaisa), 0);
  assert.equal(
    reviewedAmount('123.45', 'historical amount', october.proposedPaisa),
    12345,
  );
  assert.throws(
    () => reviewedAmount('123.45', ' ', october.proposedPaisa),
    (e) => e.code === 'reason',
  );
  assert.throws(
    () => reviewedAmount('-1', 'reason', 0),
    (e) => e.code === 'amount',
  );
  assert.throws(
    () => safeTotal([Number.MAX_SAFE_INTEGER, 1]),
    (e) => e.code === 'range',
  );
  assert.equal(
    overdue(
      { status: 'finalized', amountPaisa: 1, dueDate: '2026-10-10' },
      '2026-10-28',
    ),
    true,
  );
  assert.equal(
    overdue(
      { status: 'draft', amountPaisa: 1, dueDate: '2026-10-10' },
      '2026-10-28',
    ),
    false,
  );
  assert.equal(
    overdue(
      { status: 'finalized', amountPaisa: 0, dueDate: '2026-10-10' },
      '2026-10-28',
    ),
    false,
  );
});

test('v8 upgrade preserves parent records/locale and adds an empty ledger', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    await writeLanguage(c.db, 'en');
    await c.db.execAsync(
      'DROP TABLE payment_allocations; DROP TABLE payments; DROP TABLE tenancy_charge_versions; DROP TABLE bill_lines; DROP TABLE bills; PRAGMA user_version=8',
    );
    await migrateDatabase(c.db);
    await migrateDatabase(c.db);
    assert.equal(
      (await c.db.getFirstAsync('PRAGMA user_version')).user_version,
      11,
    );
    assert.equal(await readLanguage(c.db), 'en');
    assert.equal((await listProperties(c.db))[0].id, f.houseId);
    assert.equal((await listFloors(c.db, f.houseId))[0].floorCodeName, 'F1');
    assert.equal((await listUnits(c.db, f.floorId)).length, 2);
    assert.equal((await listTenants(c.db))[0].id, f.tenantId);
    assert.equal((await getCurrentTenancy(c.db, f.unitId)).id, f.tenancyId);
    assert.deepEqual(await listBills(c.db), []);
  } finally {
    c.close();
  }
});

test('drafts survive restart, preserve reviewed values/reason and do not create dues', async () => {
  const dir = mkdtempSync(join(tmpdir(), 'hrt-bills-')),
    file = join(dir, 'bills.db');
  let c = connect(file);
  try {
    const f = await fixture(c.db);
    const id = await draft(c.db, f.tenancyId, '2026-01', {
      amount: '১৫০০০.৫০',
      reason: ' Reviewed historical charge ',
    });
    c.close();
    c = connect(file);
    const bill = await getBill(c.db, id);
    assert.equal(bill.status, 'draft');
    assert.equal(bill.amountPaisa, 1500050);
    assert.equal(bill.proposedPaisa, 1600000);
    assert.equal(bill.overrideReason, 'Reviewed historical charge');
    assert.equal(bill.tenancyId, f.tenancyId);
    assert.equal(outstandingPaisa(await listBills(c.db)), 0);
    await draft(c.db, f.tenancyId, '2026-02', { billId: id });
    assert.equal((await getBill(c.db, id)).month, '2026-02');
    await discardDraft(c.db, id);
    assert.equal(await getBill(c.db, id), undefined);
    assert.equal(
      (await c.db.getFirstAsync('SELECT count(*) AS n FROM bill_lines')).n,
      0,
    );
  } finally {
    c.close();
    rmSync(dir, { recursive: true, force: true });
  }
});

test('one current bill per tenancy/month, idempotent finalization and isolated portfolio/unit totals', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    const a = await draft(c.db, f.tenancyId, '2026-02');
    await assert.rejects(
      draft(c.db, f.tenancyId, '2026-02'),
      (e) => e.code === 'duplicate',
    );
    const january = await draft(c.db, f.tenancyId, '2026-01'),
      beforeJanuary = await getBill(c.db, january);
    await assert.rejects(
      draft(c.db, f.tenancyId, '2026-02', { billId: january }),
      (e) => e.code === 'duplicate',
    );
    assert.deepEqual(await getBill(c.db, january), beforeJanuary);
    await discardDraft(c.db, january);
    const b = await draft(c.db, f.otherTenancy, '2026-02');
    await finalizeBill(c.db, a);
    const once = await getBill(c.db, a);
    await finalizeBill(c.db, a);
    assert.equal((await getBill(c.db, a)).finalizedAt, once.finalizedAt);
    assert.equal(outstandingPaisa(await listBills(c.db)), 3100000);
    await finalizeBill(c.db, b);
    assert.equal(outstandingPaisa(await listBills(c.db)), 3600000);
    assert.equal(
      (await tenancyBillSummary(c.db, f.otherTenancy)).outstandingPaisa,
      500000,
    );
    assert.equal((await listBills(c.db)).length, 2);
    assert.equal((await listBills(c.db, f.tenancyId)).length, 1);
  } finally {
    c.close();
  }
});

test('finalization freezes snapshots and locks setup; void preserves history, unlocks and permits distinct replacement', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    const id = await draft(c.db, f.tenancyId, '2026-02');
    await finalizeBill(c.db, id);
    const old = await getBill(c.db, id);
    await assert.rejects(
      correctTenancy(c.db, f.unitId, f.tenancyId, { ...terms, rent: '35000' }),
      (e) => e.reason === 'billed',
    );
    await assert.rejects(
      draft(c.db, f.tenancyId, '2026-02', {
        billId: id,
        amount: '1',
        reason: 'change',
      }),
      (e) => e.code === 'readonly',
    );
    await assert.rejects(discardDraft(c.db, id));
    await assert.rejects(voidBill(c.db, id, ' '), (e) => e.code === 'reason');
    await voidBill(c.db, id, 'Mistaken original');
    const voided = await getBill(c.db, id);
    await voidBill(c.db, id, 'A retry must not overwrite the original reason');
    assert.equal((await getBill(c.db, id)).voidReason, 'Mistaken original');
    assert.equal(voided.amountPaisa, old.amountPaisa);
    assert.equal(voided.proposedPaisa, old.proposedPaisa);
    assert.equal(voided.finalizedAt, old.finalizedAt);
    assert.equal(await hasFinalizedBills(c.db, f.tenancyId), false);
    assert.equal(outstandingPaisa(await listBills(c.db)), 0);
    await correctTenancy(c.db, f.unitId, f.tenancyId, {
      ...terms,
      rent: '35000',
    });
    const replacement = await draft(c.db, f.tenancyId, '2026-02');
    assert.notEqual(replacement, id);
    assert.equal((await getBill(c.db, replacement)).status, 'draft');
    await finalizeBill(c.db, replacement);
    assert.equal(outstandingPaisa(await listBills(c.db)), 3500000);
    assert.equal((await getBill(c.db, id)).referenceRentPaisa, 3100000);
  } finally {
    c.close();
  }
});

test('stale drafts require refreshed terms/review; zero finalized bills have no dues but still protect terms', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    const id = await draft(c.db, f.tenancyId);
    const before = await getBill(c.db, id);
    await correctTenancy(c.db, f.unitId, f.tenancyId, {
      ...terms,
      rent: '32000',
    });
    await assert.rejects(
      finalizeBill(c.db, id),
      (e) => e.code === 'termsChanged',
    );
    await assert.rejects(
      saveDraft(c.db, {
        tenancyId: f.tenancyId,
        billId: id,
        month: '2026-01',
        amount: '0',
        reason: 'reviewed',
        expectedSource: before.sourceSignature,
      }),
      (e) => e.code === 'termsChanged',
    );
    await draft(c.db, f.tenancyId, '2026-01', {
      billId: id,
      amount: '0',
      reason: 'Owner reviewed initial charge',
    });
    await finalizeBill(c.db, id);
    assert.equal(outstandingPaisa(await listBills(c.db)), 0);
    assert.equal(await hasFinalizedBills(c.db, f.tenancyId), true);
    await assert.rejects(
      correctTenancy(c.db, f.unitId, f.tenancyId, terms),
      (e) => e.reason === 'billed',
    );
  } finally {
    c.close();
  }
});

test('line-write failure rolls back header/line changes and read-only failures retain database values', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    await c.db.execAsync(
      "CREATE TRIGGER fail_insert BEFORE INSERT ON bill_lines BEGIN SELECT RAISE(ABORT,'injected write failure'); END",
    );
    await assert.rejects(draft(c.db, f.tenancyId));
    assert.equal(
      (await c.db.getFirstAsync('SELECT count(*) AS n FROM bills')).n,
      0,
    );
    await c.db.execAsync('DROP TRIGGER fail_insert');
    const id = await draft(c.db, f.tenancyId),
      before = await getBill(c.db, id);
    await c.db.execAsync(
      "CREATE TRIGGER fail_update BEFORE UPDATE ON bill_lines BEGIN SELECT RAISE(ABORT,'injected write failure'); END",
    );
    await assert.rejects(draft(c.db, f.tenancyId, '2026-02', { billId: id }));
    assert.deepEqual(await getBill(c.db, id), before);
    await c.db.execAsync('DROP TRIGGER fail_update');
    await assert.rejects(
      saveDraft(c.db, {
        tenancyId: -1,
        month: '2026-01',
        amount: '1',
        reason: '',
        expectedSource: 'missing',
      }),
      (e) => e.code === 'missing',
    );
    await c.db.execAsync('PRAGMA query_only=ON');
    await assert.rejects(finalizeBill(c.db, id));
    assert.deepEqual(await getBill(c.db, id), before);
  } finally {
    c.close();
  }
});

test('dedicated transaction initialization enables foreign keys before BEGIN and rolls back a rejected child write', async () => {
  const c = connect();
  try {
    await fixture(c.db);
    await c.db.execAsync('PRAGMA foreign_keys=OFF');
    await assert.rejects(
      runWriteTransaction(c.db, async (tx) => {
        assert.equal(
          (await tx.getFirstAsync('PRAGMA foreign_keys')).foreign_keys,
          1,
        );
        await tx.execAsync(
          "INSERT INTO bills (tenancy_id,billing_month,status,covered_from,covered_through,due_date,source_start_date,source_due_day,source_signature,calculation_rule,created_at,updated_at) VALUES (-1,'2026-01','draft','2026-01-01','2026-01-31','2026-01-10','2026-01-01',10,'x','x','now','now')",
        );
      }),
      /FOREIGN KEY/,
    );
    assert.equal(
      (await c.db.getFirstAsync('SELECT count(*) AS n FROM bills')).n,
      0,
    );
  } finally {
    c.close();
  }
});
