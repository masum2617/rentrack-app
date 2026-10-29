import type { SQLiteDatabase } from 'expo-sqlite';
import {
  listActiveRentals,
  type ActiveRental,
} from '../tenancies/tenancyStore.ts';
import { getTenant, listTenants, type Tenant } from './tenantStore.ts';

export type TenantSummary = Tenant & { rentals: ActiveRental[] };
export async function readTenantDirectory(
  db: SQLiteDatabase,
): Promise<TenantSummary[]> {
  const [tenants, rentals] = await Promise.all([
    listTenants(db),
    listActiveRentals(db),
  ]);
  const byTenant = new Map<number, ActiveRental[]>();
  for (const rental of rentals) {
    const group = byTenant.get(rental.tenantId);
    if (group) group.push(rental);
    else byTenant.set(rental.tenantId, [rental]);
  }
  return tenants.map((tenant) => ({
    ...tenant,
    rentals: byTenant.get(tenant.id) ?? [],
  }));
}

export async function readTenantEditor(
  db: SQLiteDatabase,
  tenantId: number,
): Promise<TenantSummary | undefined> {
  const [tenant, rentals] = await Promise.all([
    getTenant(db, tenantId),
    listActiveRentals(db, { tenantId }),
  ]);
  return tenant ? { ...tenant, rentals } : undefined;
}
