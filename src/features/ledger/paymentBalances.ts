import type { SQLiteDatabase } from 'expo-sqlite';
import { safeTotal } from './billCalculations.ts';

export async function activeAllocations(
  db: SQLiteDatabase,
  scope: { billId?: number; tenancyId?: number } = {},
) {
  const rows = await db.getAllAsync<{ lineId: number; amount: number }>(
    `SELECT a.bill_line_id AS lineId, a.amount_paisa AS amount FROM payment_allocations a
    JOIN payments p ON p.id=a.payment_id JOIN bill_lines l ON l.id=a.bill_line_id JOIN bills b ON b.id=l.bill_id
    WHERE p.status='recorded' AND (? IS NULL OR b.id=?) AND (? IS NULL OR b.tenancy_id=?)`,
    scope.billId ?? null,
    scope.billId ?? null,
    scope.tenancyId ?? null,
    scope.tenancyId ?? null,
  );
  const paid = new Map<number, number>();
  for (const row of rows)
    paid.set(row.lineId, safeTotal([paid.get(row.lineId) ?? 0, row.amount]));
  return paid;
}
export async function hasActiveBillAllocations(
  db: SQLiteDatabase,
  billId: number,
) {
  return Boolean(
    await db.getFirstAsync(
      `SELECT a.id FROM payment_allocations a JOIN payments p ON p.id=a.payment_id
    JOIN bill_lines l ON l.id=a.bill_line_id WHERE p.status='recorded' AND l.bill_id=? LIMIT 1`,
      billId,
    ),
  );
}
