// Presentation fixtures only: these are not posted bills, receipts or database records.
export const demoProperties = [
  {
    id: 'rahman',
    name: 'রহমান ভবন',
    units: 8,
    occupied: 7,
    outstanding: 24000,
    readings: 3,
    drafts: 2,
    october: { billed: 80000, received: 62000 },
    september: { billed: 78000, received: 70000 },
  },
  {
    id: 'shanti',
    name: 'শান্তি নিকেতন',
    units: 4,
    occupied: 3,
    outstanding: 12000,
    readings: 1,
    drafts: 1,
    october: { billed: 40000, received: 28000 },
    september: { billed: 38000, received: 32000 },
  },
];
export type DemoMonth = 'october' | 'september';

export function getDemoSummary(propertyId: string, month: DemoMonth) {
  const properties =
    propertyId === 'all'
      ? demoProperties
      : demoProperties.filter((property) => property.id === propertyId);
  return properties.reduce(
    (total, property) => ({
      properties: total.properties + 1,
      units: total.units + property.units,
      occupied: total.occupied + property.occupied,
      outstanding: total.outstanding + property.outstanding,
      billed: total.billed + property[month].billed,
      received: total.received + property[month].received,
      readings: total.readings + property.readings,
      drafts: total.drafts + property.drafts,
    }),
    {
      properties: 0,
      units: 0,
      occupied: 0,
      outstanding: 0,
      billed: 0,
      received: 0,
      readings: 0,
      drafts: 0,
    },
  );
}
