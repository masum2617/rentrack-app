import test from 'node:test';
import assert from 'node:assert/strict';
import { formatNumber } from '../src/i18n/formatNumber.ts';

test('Bangla digits and grouping are explicit rather than device-dependent', () => {
  assert.equal(formatNumber(120000, 'bn'), '১,২০,০০০');
  assert.equal(formatNumber(0, 'bn'), '০');
  assert.equal(formatNumber(120000, 'en'), '120,000');
});
