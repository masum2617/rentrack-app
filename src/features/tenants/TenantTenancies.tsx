import { useEffect, useState } from 'react';
import { AppState, StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { RentalLocation } from '../tenancies/RentalLocation';
import type { ActiveRental } from '../tenancies/tenancyStore';
import {
  calendarDate,
  dateForPicker,
  localDate,
} from '../tenancies/tenancyValidation';
import {
  completedResidenceMonths,
  selectedRentalFirst,
} from '../tenancies/residenceDuration';

export function TenantTenancies({
  rentals,
  selectedUnitId,
}: {
  rentals: ActiveRental[];
  selectedUnitId?: number;
}) {
  const { t, locale, number } = useLocale();
  const [today, setToday] = useState(() => localDate());
  useEffect(() => {
    const listener = AppState.addEventListener('change', (state) => {
      if (state === 'active') setToday(localDate());
    });
    return () => listener.remove();
  }, []);
  function duration(start: string) {
    const months = completedResidenceMonths(start, today);
    if (months === undefined) return t('residenceUnknown');
    if (months === 0) return t('residenceUnderMonth');
    const monthLabel = (count: number) =>
      t(count === 1 ? 'residenceMonthOne' : 'residenceMonths', {
        count: number(count),
      });
    if (months < 12) return monthLabel(months);
    const years = Math.floor(months / 12),
      remainder = months % 12;
    const yearLabel = t(years === 1 ? 'residenceYearOne' : 'residenceYears', {
      count: number(years),
    });
    return remainder
      ? t('residenceYearsMonths', {
          years: yearLabel,
          months: monthLabel(remainder),
        })
      : yearLabel;
  }
  return (
    <View style={styles.section}>
      <AppText accessibilityRole="header" variant="heading">
        {t('currentTenancies')}
      </AppText>
      {rentals.length === 0 ? (
        <AppText variant="label" color={colors.muted}>
          {t('noActiveTenancy')}
        </AppText>
      ) : (
        selectedRentalFirst(rentals, selectedUnitId).map((rental) => {
          return (
            <View
              key={rental.tenancyId}
              style={[
                styles.rental,
                rental.unitId === selectedUnitId && styles.selected,
              ]}
            >
              {rental.unitId === selectedUnitId && (
                <AppText variant="label" color={colors.brand}>
                  {t('selectedRental')}
                </AppText>
              )}
              <RentalLocation
                propertyName={rental.propertyName}
                floorName={rental.floorName}
                unitName={rental.unitName}
              />
              <AppText variant="label" color={colors.muted}>
                {calendarDate(rental.startDate)
                  ? t('rentalStartMonth', {
                      month: new Intl.DateTimeFormat(
                        locale === 'bn' ? 'bn-BD' : 'en-GB',
                        { month: 'long', year: 'numeric', calendar: 'gregory' },
                      ).format(dateForPicker(rental.startDate)),
                    })
                  : t('rentalStartUnknown')}
              </AppText>
              <AppText variant="label" color={colors.muted}>
                {t('rentalResidence', { duration: duration(rental.startDate) })}
              </AppText>
            </View>
          );
        })
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  section: {
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.line,
    paddingBottom: 24,
  },
  rental: { gap: 8, paddingVertical: 12 },
  selected: { padding: 16, borderRadius: 12, backgroundColor: colors.selected },
});
