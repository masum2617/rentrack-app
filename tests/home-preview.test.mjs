import test from 'node:test';
import assert from 'node:assert/strict';
import { getDemoSummary } from '../src/features/home/homeDemoData.ts';
import { formatNumber } from '../src/i18n/formatNumber.ts';

test('October portfolio matches the reviewed demonstration figures', () => {
  assert.deepEqual(getDemoSummary('all', 'october'), {
    properties: 2,
    units: 12,
    occupied: 10,
    outstanding: 36000,
    billed: 120000,
    received: 90000,
    readings: 4,
    drafts: 3,
  });
});

test('a property choice changes its summary and attention counts together', () => {
  const summary = getDemoSummary('shanti', 'october');
  assert.equal(summary.properties, 1);
  assert.equal(summary.units, 4);
  assert.equal(summary.billed, 40000);
  assert.equal(summary.outstanding, 12000);
  assert.equal(summary.readings, 1);
  assert.equal(summary.drafts, 1);
});

test('billing-period selection does not redefine all-month outstanding', () => {
  const september = getDemoSummary('all', 'september');
  assert.equal(september.billed, 116000);
  assert.equal(september.received, 102000);
  assert.equal(
    september.outstanding,
    getDemoSummary('all', 'october').outstanding,
  );
});

test('Bangla digits and grouping are explicit rather than device-dependent', () => {
  assert.equal(formatNumber(120000, 'bn'), '১,২০,০০০');
  assert.equal(formatNumber(0, 'bn'), '০');
  assert.equal(formatNumber(120000, 'en'), '120,000');
});
