// Cases authored for Step 10B; execution remains pending owner authorization.
import assert from 'node:assert/strict';
import { test } from 'node:test';
import { connect } from './sqlite.mjs';
import { migrateDatabase } from '../src/platform/database/migrations.ts';
import { createProperty } from '../src/features/properties/propertyStore.ts';
import { createFloor } from '../src/features/properties/floorStore.ts';
import { createUnit } from '../src/features/properties/unitStore.ts';
import { createTenant } from '../src/features/tenants/tenantStore.ts';
import { createTenancy } from '../src/features/tenancies/tenancyStore.ts';
import {
  getBillingTenancy,
  saveDraft,
  finalizeBill,
  voidBill,
} from '../src/features/ledger/billStore.ts';
import {
  proposeBill,
  sourceSignature,
} from '../src/features/ledger/billCalculations.ts';
import {
  listDueLines,
  recordPayment,
  newPaymentOperation,
  reversePayment,
} from '../src/features/ledger/paymentStore.ts';
import {
  suggestAllocations,
  allocationValues,
} from '../src/features/ledger/paymentValidation.ts';
import { matchesBillScope } from '../src/features/ledger/billFilters.ts';
import {
  readHomeData,
  homeSummary,
  homeMonths,
  filterPayableTenancies,
} from '../src/features/home/homeData.ts';
import { paisaInput, parsePaisa } from '../src/shared/money/paisa.ts';

const terms = {
  startDate: '2026-01-01',
  rent: '10000.25',
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
async function makeBill(db, tenancyId, month, finalize = true) {
  const source = await getBillingTenancy(db, tenancyId);
  const id = await saveDraft(db, {
    tenancyId,
    month,
    amount: paisaInput(proposeBill(source, month).proposedPaisa),
    reason: '',
    expectedSource: sourceSignature(source),
  });
  if (finalize) await finalizeBill(db, id);
  return id;
}
async function pay(db, tenancyId, amount, receivedOn, preferredBill) {
  const due = await listDueLines(db, tenancyId);
  return recordPayment(
    db,
    tenancyId,
    await newPaymentOperation(db),
    { amount, receivedOn, method: 'cash', reference: '', notes: '' },
    allocationValues(
      suggestAllocations(due, parsePaisa(amount), preferredBill),
    ),
  );
}
async function fixture(db) {
  await migrateDatabase(db);
  const a = await createProperty(db, {
      name: 'রহমান বাড়ি',
      location: 'মিরপুর',
      address: '',
    }),
    b = await createProperty(db, {
      name: 'Other house',
      location: 'Dhaka',
      address: '',
    });
  const floorA = await createFloor(db, a, 'Ground', 'G'),
    floorB = await createFloor(db, b, 'First', 'F');
  const unitA = await createUnit(db, floorA, unit);
  await createUnit(db, floorA, { ...unit, name: 'Vacant' });
  const unitB = await createUnit(db, floorB, { ...unit, name: 'B1' });
  const person = await createTenant(db, {
    name: 'রহিমা বেগম',
    phone: '',
    address: '',
    idType: '',
    idNumber: '',
    emergencyContact: '',
    notes: '',
  });
  const tenancyA = await createTenancy(db, unitA, person, terms),
    tenancyB = await createTenancy(db, unitB, person, {
      ...terms,
      rent: '7000.50',
    });
  const january = await makeBill(db, tenancyA, '2026-01'),
    february = await makeBill(db, tenancyA, '2026-02');
  const draft = await makeBill(db, tenancyA, '2026-03', false),
    voided = await makeBill(db, tenancyA, '2026-04');
  await voidBill(db, voided, 'Wrong bill');
  await makeBill(db, tenancyB, '2026-02');
  const paymentA = await pay(db, tenancyA, '5000', '2026-02-10', january);
  await pay(db, tenancyA, '1000.25', '2026-01-05', february);
  await pay(db, tenancyB, '2000.50', '2026-02-01');
  return {
    a,
    b,
    tenancyA,
    tenancyB,
    person,
    january,
    february,
    draft,
    voided,
    paymentA,
  };
}

test('empty database exposes real zero records without fake properties or payments', async () => {
  const c = connect();
  try {
    await migrateDatabase(c.db);
    const data = await readHomeData(c.db),
      summary = homeSummary(data, undefined, '2026-02', '2026-10-29');
    assert.equal(summary.properties, 0);
    assert.equal(summary.units, 0);
    assert.equal(summary.outstanding, 0);
    assert.equal(summary.billed, 0);
    assert.equal(summary.received, 0);
    assert.deepEqual(summary.payables, []);
  } finally {
    c.close();
  }
});

test('real property scope controls unit occupancy, bills, receipts and all-month outstanding together', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db),
      data = await readHomeData(c.db);
    const all = homeSummary(data, undefined, '2026-02', '2026-10-29'),
      a = homeSummary(data, f.a, '2026-02', '2026-10-29'),
      b = homeSummary(data, f.b, '2026-02', '2026-10-29');
    assert.equal(all.properties, 2);
    assert.equal(all.units, 3);
    assert.equal(all.occupied, 2);
    assert.equal(all.billed, 1700075);
    assert.equal(all.received, 700050);
    assert.equal(all.outstanding, 1900025);
    assert.equal(a.units, 2);
    assert.equal(a.occupied, 1);
    assert.equal(a.outstanding, 1400025);
    assert.equal(b.units, 1);
    assert.equal(b.occupied, 1);
    assert.equal(b.outstanding, 500000);
    assert.equal(all.outstanding, a.outstanding + b.outstanding);
    assert.throws(
      () => homeSummary(data, 99999, '2026-02', '2026-10-29'),
      /Property unavailable/,
    );
  } finally {
    c.close();
  }
});

test('selected billing month and actual receipt month stay distinct from all-month outstanding', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db),
      data = await readHomeData(c.db);
    const january = homeSummary(data, f.a, '2026-01', '2026-10-29'),
      february = homeSummary(data, f.a, '2026-02', '2026-10-29');
    assert.equal(january.billed, 1000025);
    assert.equal(january.received, 100025);
    assert.equal(february.billed, 1000025);
    assert.equal(february.received, 500000);
    assert.equal(january.outstanding, february.outstanding);
    const inactive = homeSummary(data, f.a, '2026-05', '2026-10-29');
    assert.equal(inactive.billed, 0);
    assert.equal(inactive.received, 0);
    assert.equal(inactive.outstanding, january.outstanding);
  } finally {
    c.close();
  }
});

test('draft and void bills never create dues; reversal restores dues and removes original receipt-month collections', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    let data = await readHomeData(c.db);
    assert.equal(homeSummary(data, f.a, '2026-03', '2026-10-29').drafts, 1);
    assert.equal(homeSummary(data, f.a, '2026-04', '2026-10-29').billed, 0);
    await reversePayment(c.db, f.paymentA, 'Wrong amount');
    data = await readHomeData(c.db);
    const summary = homeSummary(data, undefined, '2026-02', '2026-10-29');
    assert.equal(summary.received, 200050);
    assert.equal(summary.outstanding, 2400025);
  } finally {
    c.close();
  }
});

test('payable selector groups by tenancy ID and searches labels rather than merging the same person across units', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db),
      summary = homeSummary(
        await readHomeData(c.db),
        undefined,
        '2026-02',
        '2026-10-29',
      );
    assert.equal(summary.payables.length, 2);
    assert.equal(
      summary.payables.find((entry) => entry.tenancyId === f.tenancyA)
        .outstandingPaisa,
      1400025,
    );
    assert.equal(
      summary.payables.find((entry) => entry.tenancyId === f.tenancyB)
        .outstandingPaisa,
      500000,
    );
    assert.equal(filterPayableTenancies(summary.payables, 'রহিমা').length, 2);
    assert.equal(filterPayableTenancies(summary.payables, 'B1').length, 1);
    assert.equal(
      filterPayableTenancies(summary.payables, 'Other HOUSE').length,
      1,
    );
    await c.db.runAsync(
      'UPDATE tenants SET name=? WHERE id=?',
      'New name',
      f.person,
    );
    assert.equal(
      homeSummary(await readHomeData(c.db), f.a, '2026-02', '2026-10-29')
        .payables[0].tenantName,
      'New name',
    );
  } finally {
    c.close();
  }
});

test('Home bill shortcuts resolve the same property/month/outstanding and overdue scopes as the dashboard', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db),
      data = await readHomeData(c.db),
      summary = homeSummary(data, f.a, '2026-02', '2026-02-10');
    const drafts = data.bills.filter((bill) =>
      matchesBillScope(
        bill,
        { propertyId: f.a, month: '2026-03', status: 'draft' },
        '2026-10-29',
      ),
    );
    assert.deepEqual(
      drafts.map((bill) => bill.id),
      [f.draft],
    );
    const overdue = data.bills.filter((bill) =>
      matchesBillScope(
        bill,
        { propertyId: f.a, status: 'overdue' },
        '2026-02-10',
      ),
    );
    assert.equal(overdue.length, summary.overdue);
    const outstanding = data.bills.filter((bill) =>
      matchesBillScope(bill, { propertyId: f.a, status: 'outstanding' }),
    );
    assert.equal(outstanding.length, 2);
    assert.ok(outstanding.every((bill) => bill.status === 'finalized'));
  } finally {
    c.close();
  }
});

test('month choices include zero-activity gaps and receipt dates before tenancy start, through the current month', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    await pay(c.db, f.tenancyA, '1', '2025-12-20');
    const months = homeMonths(await readHomeData(c.db), '2026-10-29');
    assert.equal(months[0], '2026-10');
    assert.equal(months.at(-1), '2025-12');
    assert.equal(months.length, 11);
    assert.ok(months.includes('2026-08'));
  } finally {
    c.close();
  }
});

test('failed reads reject the whole snapshot and never return fabricated zero summaries', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db),
      before = await readHomeData(c.db);
    const broken = {
      ...c.db,
      async getAllAsync(sql, ...params) {
        if (sql.includes('FROM payments p JOIN tenancies'))
          throw new Error('injected read failure');
        return c.db.getAllAsync(sql, ...params);
      },
    };
    broken.withExclusiveTransactionAsync = (task) =>
      c.db.withExclusiveTransactionAsync(() => task(broken));
    await assert.rejects(readHomeData(broken), /injected read failure/);
    assert.deepEqual(await readHomeData(c.db), before);
    assert.equal(
      homeSummary(before, f.a, '2026-02', '2026-10-29').outstanding,
      1400025,
    );
  } finally {
    c.close();
  }
});

test('unsupported aggregate totals and future months fail explicitly instead of rounding or showing zero', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db),
      data = await readHomeData(c.db);
    const huge = {
      ...data,
      bills: data.bills.map((bill) => ({
        ...bill,
        outstandingPaisa:
          bill.status === 'finalized' ? Number.MAX_SAFE_INTEGER : 0,
      })),
    };
    assert.throws(() => homeSummary(huge, f.a, '2026-02', '2026-10-29'));
    assert.throws(
      () => homeSummary(data, f.a, '2027-01', '2026-10-29'),
      /Invalid summary month/,
    );
  } finally {
    c.close();
  }
});
