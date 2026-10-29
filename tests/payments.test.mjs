// Authored cases only. Do not execute until the owner authorizes regression runs.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { mkdtempSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
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
import { createTenancy } from '../src/features/tenancies/tenancyStore.ts';
import {
  listChargeVersions,
  applicableCharges,
  chargeSignature,
} from '../src/features/tenancies/chargeSettings.ts';
import { initialExtras } from '../src/features/ledger/additionalCharges.ts';
import {
  proposeBill,
  sourceSignature,
} from '../src/features/ledger/billCalculations.ts';
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
  paymentValues,
  suggestAllocations,
  allocationValues,
  validateAllocations,
} from '../src/features/ledger/paymentValidation.ts';
import {
  newPaymentOperation,
  recordPayment,
  reversePayment,
  getPayment,
  listPayments,
  listDueLines,
  receiptAllocations,
} from '../src/features/ledger/paymentStore.ts';
import { paisaInput } from '../src/shared/money/paisa.ts';
import {
  billStatus,
  billIsOverdue,
} from '../src/features/ledger/billPresentation.ts';

const terms = {
  startDate: '2026-01-01',
  rent: '10000',
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
const charges = {
  water: { mode: 'fixed', amount: '500' },
  service: { mode: 'fixed', amount: '1000' },
  gas: { mode: 'none', amount: '' },
};
const received = {
  amount: '5000',
  receivedOn: '2026-02-10',
  method: 'cash',
  reference: 'Ref 01',
  notes: '',
};
async function fixture(db) {
  await migrateDatabase(db);
  const propertyId = await createProperty(db, {
    name: 'House',
    location: 'Dhaka',
    address: '',
  });
  const floorId = await createFloor(db, propertyId, 'Ground', 'G');
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
  const tenancyId = await createTenancy(db, unitId, tenantId, terms, charges),
    otherTenancy = await createTenancy(db, otherUnit, tenantId, terms);
  return { tenancyId, otherTenancy, tenantId, propertyId, floorId, unitId };
}
async function bill(db, tenancyId, month, finalize = true) {
  const source = await getBillingTenancy(db, tenancyId),
    version = applicableCharges(await listChargeVersions(db, tenancyId), month);
  const id = await saveDraft(db, {
    tenancyId,
    month,
    amount: paisaInput(proposeBill(source, month).proposedPaisa),
    reason: '',
    expectedSource: sourceSignature(source),
    expectedCharges: chargeSignature(version),
    extras: initialExtras(version),
  });
  if (finalize) await finalizeBill(db, id);
  return id;
}
async function pay(
  db,
  tenancyId,
  input = received,
  preferredBillId,
  operationId,
) {
  const due = await listDueLines(db, tenancyId);
  return recordPayment(
    db,
    tenancyId,
    operationId ?? (await newPaymentOperation(db)),
    input,
    allocationValues(
      suggestAllocations(
        due,
        paymentValues(input).amountPaisa,
        preferredBillId,
      ),
    ),
  );
}

test('received amount/date/method validation accepts exact Bangla digits and early receipts, rejects invalid entries', () => {
  assert.equal(
    paymentValues(
      { ...received, amount: '৫০০০.২৫', receivedOn: '2025-12-01' },
      '2026-02-10',
    ).amountPaisa,
    500025,
  );
  for (const amount of ['', '0', '-1', '1.234', '90071992547409.92'])
    assert.throws(
      () => paymentValues({ ...received, amount }),
      (error) => error.code === 'amount',
    );
  assert.throws(
    () => paymentValues({ ...received, receivedOn: '2026-02-30' }),
    (error) => error.code === 'date',
  );
  assert.throws(
    () =>
      paymentValues({ ...received, receivedOn: '2026-02-11' }, '2026-02-10'),
    (error) => error.code === 'date',
  );
  assert.throws(
    () => paymentValues({ ...received, method: '' }),
    (error) => error.code === 'method',
  );
  for (const method of ['cash', 'bank', 'wallet'])
    assert.equal(paymentValues({ ...received, method }).method, method);
});

test('v10 migration preserves bill/line IDs, settings, parents, status, amounts and preferences', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    const draft = await bill(c.db, f.tenancyId, '2026-01', false);
    const finalized = await bill(c.db, f.tenancyId, '2026-02');
    const voided = await bill(c.db, f.tenancyId, '2026-03');
    await voidBill(c.db, voided, 'Correction');
    await writeLanguage(c.db, 'en');
    const before = await listBills(c.db),
      versions = await listChargeVersions(c.db, f.tenancyId);
    await c.db.execAsync(
      'DROP TABLE payment_allocations; DROP TABLE payments; PRAGMA user_version=10',
    );
    await migrateDatabase(c.db);
    await migrateDatabase(c.db);
    assert.equal(
      (await c.db.getFirstAsync('PRAGMA user_version')).user_version,
      11,
    );
    assert.equal(await readLanguage(c.db), 'en');
    assert.deepEqual(await listBills(c.db), before);
    assert.deepEqual(await listChargeVersions(c.db, f.tenancyId), versions);
    assert.equal((await getBill(c.db, draft)).status, 'draft');
    assert.equal((await getBill(c.db, finalized)).status, 'finalized');
    assert.equal((await getBill(c.db, voided)).status, 'void');
    assert.deepEqual(await listPayments(c.db), []);
  } finally {
    c.close();
  }
});

test('oldest-first partial payment reduces the same unit/global bill balances and receipt persists after restart', async () => {
  const folder = mkdtempSync(join(tmpdir(), 'payments-')),
    path = join(folder, 'app.db');
  let c = connect(path);
  try {
    const f = await fixture(c.db),
      january = await bill(c.db, f.tenancyId, '2026-01');
    await bill(c.db, f.tenancyId, '2026-02');
    const due = await listDueLines(c.db, f.tenancyId),
      suggested = allocationValues(suggestAllocations(due, 500000));
    assert.equal(due[0].month, '2026-01');
    assert.equal(due[0].kind, 'rent');
    assert.deepEqual(suggested, [
      { lineId: due[0].lineId, amountPaisa: 500000 },
    ]);
    const id = await pay(c.db, f.tenancyId);
    c.close();
    c = connect(path);
    await migrateDatabase(c.db);
    const saved = await getPayment(c.db, id);
    assert.equal(saved.remainingPaisa, 1800000);
    assert.equal(saved.amountPaisa, 500000);
    assert.equal(saved.receivedOn, received.receivedOn);
    assert.equal(saved.method, 'cash');
    const partial = await getBill(c.db, january);
    assert.equal(partial.paidPaisa, 500000);
    assert.equal(partial.outstandingPaisa, 650000);
    assert.equal(billStatus(partial), 'paymentPartial');
    assert.equal(billIsOverdue(partial, '2026-02-10'), true);
    assert.equal(
      (await tenancyBillSummary(c.db, f.tenancyId)).outstandingPaisa,
      1800000,
    );
    assert.equal(outstandingPaisa(await listBills(c.db)), 1800000);
    assert.equal((await receiptAllocations(c.db, id))[0].month, '2026-01');
  } finally {
    c.close();
    rmSync(folder, { recursive: true, force: true });
  }
});

test('later-month and charge-specific allocations leave older dues outstanding; full payment settles exactly', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db),
      january = await bill(c.db, f.tenancyId, '2026-01'),
      february = await bill(c.db, f.tenancyId, '2026-02');
    await pay(c.db, f.tenancyId, received, february);
    assert.equal((await getBill(c.db, january)).outstandingPaisa, 1150000);
    assert.equal((await getBill(c.db, february)).outstandingPaisa, 650000);
    const water = (await listDueLines(c.db, f.tenancyId)).find(
      (line) => line.billId === january && line.kind === 'water',
    );
    await recordPayment(
      c.db,
      f.tenancyId,
      await newPaymentOperation(c.db),
      { ...received, amount: '500', method: 'wallet' },
      [{ lineId: water.lineId, amountPaisa: 50000 }],
    );
    assert.equal((await getBill(c.db, january)).outstandingPaisa, 1100000);
    await pay(c.db, f.tenancyId, {
      ...received,
      amount: '17500',
      method: 'bank',
    });
    assert.equal(outstandingPaisa(await listBills(c.db)), 0);
    assert.deepEqual(await listDueLines(c.db, f.tenancyId), []);
    const settled = await getBill(c.db, january);
    assert.equal(billStatus(settled), 'paymentSettled');
    assert.equal(billIsOverdue(settled, '2026-03-01'), false);
  } finally {
    c.close();
  }
});

test('same operation retries return one receipt, changed payload exposes it, separate operations stay separate', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    await bill(c.db, f.tenancyId, '2026-01');
    const due = await listDueLines(c.db, f.tenancyId),
      allocations = allocationValues(suggestAllocations(due, 500000));
    const operation = await newPaymentOperation(c.db),
      id = await recordPayment(
        c.db,
        f.tenancyId,
        operation,
        received,
        allocations,
      );
    assert.equal(
      await recordPayment(c.db, f.tenancyId, operation, received, allocations),
      id,
    );
    await assert.rejects(
      recordPayment(
        c.db,
        f.tenancyId,
        operation,
        { ...received, notes: 'Different' },
        allocations,
      ),
      (error) => error.code === 'operation' && error.paymentId === id,
    );
    assert.equal((await listPayments(c.db)).length, 1);
    await pay(c.db, f.tenancyId);
    assert.equal((await listPayments(c.db)).length, 2);
    assert.equal(outstandingPaisa(await listBills(c.db)), 150000);
  } finally {
    c.close();
  }
});

test('excess, unallocated, duplicate, stale and cross-tenancy line submissions leave all balances unchanged', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    const january = await bill(c.db, f.tenancyId, '2026-01');
    const draft = await bill(c.db, f.tenancyId, '2026-02', false),
      other = await bill(c.db, f.otherTenancy, '2026-01');
    const rent = (await listDueLines(c.db, f.tenancyId))[0],
      otherLine = (await getBill(c.db, other)).lines[0],
      draftLine = (await getBill(c.db, draft)).lines[0];
    await assert.rejects(
      pay(c.db, f.tenancyId, { ...received, amount: '11500.01' }),
      (error) => error.code === 'excess',
    );
    for (const allocations of [
      [],
      [{ lineId: rent.lineId, amountPaisa: 1 }],
      [
        { lineId: rent.lineId, amountPaisa: 250000 },
        { lineId: rent.lineId, amountPaisa: 250000 },
      ],
      [{ lineId: otherLine.id, amountPaisa: 500000 }],
      [{ lineId: draftLine.id, amountPaisa: 500000 }],
    ]) {
      await assert.rejects(
        recordPayment(
          c.db,
          f.tenancyId,
          await newPaymentOperation(c.db),
          received,
          allocations,
        ),
      );
    }
    assert.equal((await getBill(c.db, january)).outstandingPaisa, 1150000);
    assert.deepEqual(await listPayments(c.db), []);
    const initial = allocationValues(
      suggestAllocations(await listDueLines(c.db, f.tenancyId), 1000000),
    );
    await pay(c.db, f.tenancyId, { ...received, amount: '10000' });
    await assert.rejects(
      recordPayment(
        c.db,
        f.tenancyId,
        await newPaymentOperation(c.db),
        { ...received, amount: '10000' },
        initial,
      ),
    );
    await assert.rejects(
      recordPayment(c.db, 99999, await newPaymentOperation(c.db), received, []),
      (error) => error.code === 'missing',
    );
  } finally {
    c.close();
  }
});

test('payment rollback and reversal rollback preserve recorded money and prior balances', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    await bill(c.db, f.tenancyId, '2026-01');
    await c.db.execAsync(
      "CREATE TRIGGER fail_allocation BEFORE INSERT ON payment_allocations WHEN NEW.charge_kind='service' BEGIN SELECT RAISE(ABORT,'injected'); END",
    );
    await assert.rejects(
      pay(c.db, f.tenancyId, { ...received, amount: '11500' }),
    );
    assert.deepEqual(await listPayments(c.db), []);
    assert.equal(outstandingPaisa(await listBills(c.db)), 1150000);
    await c.db.execAsync('DROP TRIGGER fail_allocation');
    const id = await pay(c.db, f.tenancyId),
      before = await getPayment(c.db, id);
    await c.db.execAsync(
      "CREATE TRIGGER fail_reversal BEFORE UPDATE ON payments BEGIN SELECT RAISE(ABORT,'injected'); END",
    );
    await assert.rejects(reversePayment(c.db, id, 'Wrong amount'));
    assert.deepEqual(await getPayment(c.db, id), before);
    assert.equal(outstandingPaisa(await listBills(c.db)), 650000);
  } finally {
    c.close();
  }
});

test('reasoned idempotent reversal restores every allocated bill and unlocks void without erasing receipt history', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db),
      january = await bill(c.db, f.tenancyId, '2026-01'),
      february = await bill(c.db, f.tenancyId, '2026-02');
    const id = await pay(c.db, f.tenancyId, { ...received, amount: '15000' });
    const before = await getPayment(c.db, id),
      allocations = await receiptAllocations(c.db, id);
    await assert.rejects(
      voidBill(c.db, january, 'Correction'),
      (error) => error.code === 'allocated',
    );
    await assert.rejects(
      voidBill(c.db, february, 'Correction'),
      (error) => error.code === 'allocated',
    );
    await assert.rejects(
      reversePayment(c.db, id, ' '),
      (error) => error.code === 'reason',
    );
    await reversePayment(c.db, id, 'Incorrect amount');
    const reversed = await getPayment(c.db, id);
    assert.equal(reversed.status, 'reversed');
    assert.equal(reversed.amountPaisa, before.amountPaisa);
    assert.equal(reversed.recordedAt, before.recordedAt);
    assert.deepEqual(await receiptAllocations(c.db, id), allocations);
    await reversePayment(c.db, id, 'Second reason');
    assert.deepEqual(await getPayment(c.db, id), reversed);
    assert.equal(outstandingPaisa(await listBills(c.db)), 2300000);
    await voidBill(c.db, january, 'Correct bill');
    assert.equal(outstandingPaisa(await listBills(c.db)), 1150000);
    assert.equal((await listPayments(c.db, { billId: january }))[0].id, id);
    assert.equal(
      (await listPayments(c.db, { tenancyId: f.tenancyId })).length,
      1,
    );
  } finally {
    c.close();
  }
});

test('receipt identity and charge labels remain snapshots after later renames', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    await bill(c.db, f.tenancyId, '2026-01');
    const id = await pay(c.db, f.tenancyId),
      before = await getPayment(c.db, id),
      allocations = await receiptAllocations(c.db, id);
    await c.db.runAsync(
      'UPDATE tenants SET name=? WHERE id=?',
      'New person name',
      f.tenantId,
    );
    await c.db.runAsync(
      'UPDATE properties SET name=? WHERE id=?',
      'Renamed house',
      f.propertyId,
    );
    await c.db.runAsync(
      'UPDATE floors SET name=? WHERE id=?',
      'Renamed floor',
      f.floorId,
    );
    await c.db.runAsync(
      'UPDATE units SET name=? WHERE id=?',
      'Renamed unit',
      f.unitId,
    );
    assert.deepEqual(await getPayment(c.db, id), before);
    assert.deepEqual(await receiptAllocations(c.db, id), allocations);
  } finally {
    c.close();
  }
});

test('a finalized zero-charge bill has no dues and no implied payment', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db),
      source = await getBillingTenancy(c.db, f.otherTenancy);
    const id = await saveDraft(c.db, {
      tenancyId: f.otherTenancy,
      month: '2026-01',
      amount: '0',
      reason: 'Reviewed zero charge',
      expectedSource: sourceSignature(source),
    });
    await finalizeBill(c.db, id);
    const zero = await getBill(c.db, id);
    assert.equal(zero.outstandingPaisa, 0);
    assert.equal(zero.paidPaisa, 0);
    assert.equal(billStatus(zero), 'billNoDues');
    assert.deepEqual(
      await listPayments(c.db, { tenancyId: f.otherTenancy }),
      [],
    );
  } finally {
    c.close();
  }
});
