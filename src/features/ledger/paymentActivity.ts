import type { SQLiteDatabase } from 'expo-sqlite';

export type PaymentActivity = {
  propertyId: number;
  receivedOn: string;
  amountPaisa: number;
  status: 'recorded' | 'reversed';
};
export function listPaymentActivity(
  db: SQLiteDatabase,
): Promise<PaymentActivity[]> {
  return db.getAllAsync<PaymentActivity>(`SELECT h.id AS propertyId, p.received_on AS receivedOn, p.amount_paisa AS amountPaisa, p.status
    FROM payments p JOIN tenancies t ON t.id=p.tenancy_id JOIN units u ON u.id=t.unit_id
    JOIN floors f ON f.id=u.floor_id JOIN properties h ON h.id=f.property_id`);
}
