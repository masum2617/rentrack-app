import type { SQLiteDatabase } from 'expo-sqlite';
import {
  listPropertySummaries,
  type PropertySummary,
} from '../properties/propertyStore.ts';
import { listBills, outstandingPaisa, type Bill } from '../ledger/billStore.ts';
import {
  listPaymentActivity,
  type PaymentActivity,
} from '../ledger/paymentActivity.ts';
import { safeTotal } from '../ledger/billCalculations.ts';
import { billIsOverdue } from '../ledger/billPresentation.ts';
import { calendarDate, localDate } from '../tenancies/tenancyValidation.ts';

export type HomeData = {
  properties: PropertySummary[];
  bills: Bill[];
  payments: PaymentActivity[];
};
export type PayableTenancy = {
  tenancyId: number;
  tenantName: string;
  propertyName: string;
  floorName: string;
  unitName: string;
  outstandingPaisa: number;
};
export async function readHomeData(db: SQLiteDatabase): Promise<HomeData> {
  let result: HomeData | undefined;
  // Reuse the configured dedicated transaction for a consistent multi-query snapshot.
  // No rows are written; concurrent payment/void writes wait until these reads complete.
  await db.withExclusiveTransactionAsync(async (tx) => {
    const [properties, bills, payments] = await Promise.all([
      listPropertySummaries(tx),
      listBills(tx),
      listPaymentActivity(tx),
    ]);
    result = { properties, bills, payments };
  });
  if (!result) throw new Error('Home snapshot unavailable');
  return result;
}
export function homeSummary(
  data: HomeData,
  propertyId: number | undefined,
  month: string,
  today = localDate(),
) {
  if (!calendarDate(`${month}-01`) || month > today.slice(0, 7))
    throw new Error('Invalid summary month');
  if (
    propertyId !== undefined &&
    !data.properties.some((property) => property.id === propertyId)
  )
    throw new Error('Property unavailable');
  const properties = data.properties.filter(
    (property) => propertyId === undefined || property.id === propertyId,
  );
  const bills = data.bills.filter(
    (bill) => propertyId === undefined || bill.propertyId === propertyId,
  );
  const monthBills = bills.filter((bill) => bill.month === month);
  const grouped = new Map<number, PayableTenancy>();
  for (const bill of bills) {
    if (bill.status !== 'finalized' || !bill.outstandingPaisa) continue;
    const prior = grouped.get(bill.tenancyId);
    grouped.set(bill.tenancyId, {
      tenancyId: bill.tenancyId,
      tenantName: bill.tenantName,
      propertyName: bill.propertyName,
      floorName: bill.floorName,
      unitName: bill.unitName,
      outstandingPaisa: safeTotal([
        prior?.outstandingPaisa ?? 0,
        bill.outstandingPaisa,
      ]),
    });
  }
  return {
    properties: properties.length,
    units: safeTotal(properties.map((property) => property.unitCount)),
    occupied: safeTotal(properties.map((property) => property.rentedUnitCount)),
    outstanding: outstandingPaisa(bills),
    billed: safeTotal(
      monthBills
        .filter((bill) => bill.status === 'finalized')
        .map((bill) => bill.amountPaisa),
    ),
    received: safeTotal(
      data.payments
        .filter(
          (payment) =>
            payment.status === 'recorded' &&
            payment.receivedOn.slice(0, 7) === month &&
            (propertyId === undefined || payment.propertyId === propertyId),
        )
        .map((payment) => payment.amountPaisa),
    ),
    drafts: monthBills.filter((bill) => bill.status === 'draft').length,
    monthBillCount: monthBills.filter((bill) => bill.status === 'finalized')
      .length,
    overdue: bills.filter((bill) => billIsOverdue(bill, today)).length,
    payables: [...grouped.values()],
  };
}
export function homeMonths(data: HomeData, today = localDate()): string[] {
  const current = today.slice(0, 7);
  const earliest = [
    ...data.bills.map((bill) => bill.month),
    ...data.payments.map((payment) => payment.receivedOn.slice(0, 7)),
    current,
  ].sort()[0];
  const months: string[] = [];
  for (
    let year = Number(current.slice(0, 4));
    year >= Number(earliest.slice(0, 4));
    year -= 1
  ) {
    for (let month = 12; month >= 1; month -= 1) {
      const value = `${String(year).padStart(4, '0')}-${String(month).padStart(2, '0')}`;
      if (value >= earliest && value <= current) months.push(value);
    }
  }
  return months;
}
export function filterPayableTenancies(
  tenancies: PayableTenancy[],
  search: string,
) {
  const query = search.normalize('NFKC').trim().toLowerCase();
  return tenancies.filter((tenancy) =>
    [
      tenancy.tenantName,
      tenancy.propertyName,
      tenancy.floorName,
      tenancy.unitName,
    ].some((value) => value.normalize('NFKC').toLowerCase().includes(query)),
  );
}
