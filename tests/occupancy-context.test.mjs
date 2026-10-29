import assert from 'node:assert/strict';
import { test } from 'node:test';
import { connect } from './sqlite.mjs';
import { migrateDatabase } from '../src/platform/database/migrations.ts';
import {
  createProperty,
  updateProperty,
  listPropertySummaries,
} from '../src/features/properties/propertyStore.ts';
import {
  createFloor,
  updateFloor,
  listFloorSummaries,
} from '../src/features/properties/floorStore.ts';
import {
  createUnit,
  updateUnit,
} from '../src/features/properties/unitStore.ts';
import {
  createTenant,
  updateTenant,
  getTenant,
  filterTenants,
} from '../src/features/tenants/tenantStore.ts';
import {
  readTenantDirectory,
  readTenantEditor,
} from '../src/features/tenants/tenantReadModel.ts';
import {
  createTenancy,
  correctTenancy,
  getCurrentTenancy,
  listActiveRentals,
  listFloorOccupancy,
} from '../src/features/tenancies/tenancyStore.ts';
import {
  completedResidenceMonths,
  selectedRentalFirst,
} from '../src/features/tenancies/residenceDuration.ts';

const terms = {
  startDate: '2026-01-15',
  rent: '10000',
  dueDay: '10',
  noticeMonths: '2',
  agreedAdvance: '20000',
};
const layout = {
  name: 'A',
  sizeSqFt: '',
  bedrooms: '2',
  drawingRooms: '1',
  totalBathrooms: '1',
  attachedBathrooms: '0',
  balconies: '1',
  notes: '',
};
const person = {
  name: 'রহিমা',
  phone: '01712',
  address: 'Dhaka',
  idType: '',
  idNumber: '',
  emergencyContact: '',
  notes: '',
};
async function fixture(db) {
  await migrateDatabase(db);
  const emptyHouse = await createProperty(db, {
    name: 'Empty',
    location: 'Dhaka',
    address: '',
  });
  const house = await createProperty(db, {
    name: 'House A',
    location: 'Dhaka',
    address: '',
  });
  const otherHouse = await createProperty(db, {
    name: 'House B',
    location: 'Dhaka',
    address: '',
  });
  const empty = await createFloor(db, house, 'No units');
  const vacant = await createFloor(db, house, 'Vacant');
  const partial = await createFloor(db, house, 'Partial');
  const full = await createFloor(db, house, 'Full');
  const otherFloor = await createFloor(db, otherHouse, 'Ground');
  const vacantUnit = await createUnit(db, vacant, layout);
  const partialUnit = await createUnit(db, partial, layout);
  await createUnit(db, partial, { ...layout, name: 'B' });
  const fullUnit = await createUnit(db, full, layout);
  const anotherFullUnit = await createUnit(db, full, { ...layout, name: 'B' });
  const otherUnit = await createUnit(db, otherFloor, layout);
  const tenant = await createTenant(db, person);
  const another = await createTenant(db, { ...person, name: 'Karim' });
  const inactive = await createTenant(db, {
    ...person,
    name: 'No active rental',
  });
  const tenancy = await createTenancy(db, partialUnit, tenant, terms);
  await createTenancy(db, fullUnit, tenant, terms);
  await createTenancy(db, anotherFullUnit, another, terms);
  await createTenancy(db, otherUnit, tenant, terms);
  const closed = await createTenancy(db, vacantUnit, inactive, terms);
  await db.runAsync(
    'UPDATE tenancies SET ended_on=? WHERE id=?',
    '2026-02-01',
    closed,
  );
  return {
    emptyHouse,
    house,
    otherHouse,
    empty,
    vacant,
    partial,
    full,
    partialUnit,
    otherUnit,
    tenant,
    another,
    inactive,
    tenancy,
  };
}

test('house/floor summaries count open rented units, not distinct people, and exclude closed rentals', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    const houses = await listPropertySummaries(c.db);
    assert.equal(houses.find((h) => h.id === f.emptyHouse).rentedUnitCount, 0);
    const house = houses.find((h) => h.id === f.house);
    assert.equal(house.floorCount, 4);
    assert.equal(house.unitCount, 5);
    assert.equal(house.rentedUnitCount, 3);
    assert.equal(houses.find((h) => h.id === f.otherHouse).rentedUnitCount, 1);
    const floors = await listFloorSummaries(c.db, f.house);
    assert.deepEqual(
      floors.map(({ unitCount, rentedUnitCount }) => [
        unitCount,
        rentedUnitCount,
      ]),
      [
        [0, 0],
        [1, 0],
        [2, 1],
        [2, 2],
      ],
    );
    const occupancy = await listFloorOccupancy(c.db, f.partial);
    assert.deepEqual(occupancy, [
      {
        unitId: f.partialUnit,
        unitName: 'A',
        tenantId: f.tenant,
        tenantName: person.name,
      },
    ]);
    assert.deepEqual(await listFloorOccupancy(c.db, f.vacant), []);
    assert.equal(
      (await listActiveRentals(c.db, { propertyId: f.house })).length,
      3,
    );
  } finally {
    c.close();
  }
});

test('tenant directory/editor return all active locations by ID, including several houses and no-rental people', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    const directory = await readTenantDirectory(c.db);
    assert.equal(directory.find((t) => t.id === f.tenant).rentals.length, 3);
    assert.equal(directory.find((t) => t.id === f.another).rentals.length, 1);
    assert.deepEqual(directory.find((t) => t.id === f.inactive).rentals, []);
    const current = await readTenantEditor(c.db, f.tenant);
    assert.equal(current.id, f.tenant);
    assert.deepEqual(
      new Set(current.rentals.map((r) => r.propertyId)),
      new Set([f.house, f.otherHouse]),
    );
    assert.equal(
      selectedRentalFirst(current.rentals, f.otherUnit)[0].unitId,
      f.otherUnit,
    );
    assert.equal(filterTenants(directory, person.name)[0].rentals.length, 3);
    assert.equal(await getTenant(c.db, -1), undefined);
    assert.equal(await readTenantEditor(c.db, -1), undefined);
    assert.equal(
      (
        await listActiveRentals(c.db, {
          propertyId: f.house,
          tenantId: f.tenant,
        })
      ).length,
      2,
    );
  } finally {
    c.close();
  }
});

test('fresh projections reflect renames and tenancy changes; identity editing leaves terms and links intact', async () => {
  const c = connect();
  try {
    const f = await fixture(c.db);
    const { tenantName, tenantPhone, ...beforeTerms } = await getCurrentTenancy(
      c.db,
      f.partialUnit,
    );
    await updateTenant(c.db, f.tenant, {
      ...person,
      name: 'Renamed person',
      phone: '01999',
    });
    const {
      tenantName: changedName,
      tenantPhone: changedPhone,
      ...afterTerms
    } = await getCurrentTenancy(c.db, f.partialUnit);
    assert.deepEqual(afterTerms, beforeTerms);
    assert.equal(changedName, 'Renamed person');
    assert.equal(changedPhone, '01999');
    await updateProperty(c.db, f.house, {
      name: 'Renamed house',
      location: 'Dhaka',
      address: '',
    });
    await updateFloor(c.db, f.house, f.partial, 'Renamed floor');
    await updateUnit(c.db, f.partial, f.partialUnit, {
      ...layout,
      name: 'Renamed unit',
    });
    await correctTenancy(c.db, f.partialUnit, f.tenancy, {
      ...terms,
      startDate: '2026-02-01',
    });
    const rental = (await readTenantEditor(c.db, f.tenant)).rentals.find(
      (r) => r.unitId === f.partialUnit,
    );
    assert.equal(rental.propertyName, 'Renamed house');
    assert.equal(rental.floorName, 'Renamed floor');
    assert.equal(rental.unitName, 'Renamed unit');
    assert.equal(rental.startDate, '2026-02-01');
    assert.equal(
      (await listFloorOccupancy(c.db, f.partial))[0].tenantName,
      'Renamed person',
    );
  } finally {
    c.close();
  }
});

test('residence duration uses completed clamped calendar months across leap/year boundaries', () => {
  for (const [start, today, months] of [
    ['2026-01-15', '2026-01-15', 0],
    ['2026-01-15', '2026-02-14', 0],
    ['2026-01-15', '2026-02-15', 1],
    ['2026-01-31', '2026-02-28', 1],
    ['2026-01-31', '2026-03-30', 1],
    ['2026-01-31', '2026-04-30', 3],
    ['2024-02-29', '2025-02-27', 11],
    ['2024-02-29', '2025-02-28', 12],
    ['2024-12-31', '2026-02-28', 14],
    ['1899-02-28', '1900-02-28', 12],
  ])
    assert.equal(completedResidenceMonths(start, today), months);
  assert.equal(completedResidenceMonths('2026-02-29', '2026-03-01'), undefined);
  assert.equal(completedResidenceMonths('2026-03-01', '2026-02-28'), undefined);
  const rentals = [{ unitId: 1 }, { unitId: 2 }, { unitId: 3 }];
  assert.deepEqual(
    selectedRentalFirst(rentals, 2).map((r) => r.unitId),
    [2, 1, 3],
  );
  assert.deepEqual(
    rentals.map((r) => r.unitId),
    [1, 2, 3],
  );
});
