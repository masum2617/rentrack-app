import { calendarDate } from './tenancyValidation.ts';

// Full calendar months, using the last day for month-end anniversaries.
export function completedResidenceMonths(
  start: string,
  today: string,
): number | undefined {
  if (!calendarDate(start) || !calendarDate(today) || start > today)
    return undefined;
  const [startYear, startMonth, startDay] = start.split('-').map(Number);
  const [year, month, day] = today.split('-').map(Number);
  const leap = year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0);
  const monthDays = [
    31,
    leap ? 29 : 28,
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];
  const anniversary = Math.min(startDay, monthDays[month - 1]);
  return (
    (year - startYear) * 12 + month - startMonth - (day < anniversary ? 1 : 0)
  );
}

export function selectedRentalFirst<T extends { unitId: number }>(
  rentals: T[],
  unitId?: number,
): T[] {
  if (unitId === undefined) return rentals;
  return [...rentals].sort(
    (a, b) => Number(b.unitId === unitId) - Number(a.unitId === unitId),
  );
}
