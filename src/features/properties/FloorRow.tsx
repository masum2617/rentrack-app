import { EditButton } from '../../shared/ui/EditButton';
import { Pressable, StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { fontFamilies } from '../../theme/typography';
import type { Floor, FloorSummary } from './floorStore';
import type { ActiveRental } from '../tenancies/tenancyStore';

export function FloorRow({
  floor,
  rentals,
  onEdit,
  onOpen,
}: {
  floor: FloorSummary;
  rentals: ActiveRental[];
  onEdit: (floor: Floor) => void;
  onOpen: () => void;
}) {
  const { t, number } = useLocale();
  return (
    <View style={[surfaces.card, styles.row]}>
      <Pressable
        style={styles.identity}
        accessibilityRole="button"
        accessibilityLabel={t('viewFloorUnits', { name: floor.name })}
        onPress={onOpen}
      >
        <AppText
          variant="heading"
          style={
            /[\u0980-\u09ff]/.test(floor.name)
              ? { fontFamily: fontFamilies.bn.semibold }
              : undefined
          }
        >
          {floor.name}
        </AppText>
        <AppText variant="label" color={colors.muted}>
          {t('floorRentalCounts', {
            total: number(floor.unitCount),
            rented: number(floor.rentedUnitCount),
          })}
        </AppText>
        <AppText variant="label" color={colors.brand}>
          {t(
            floor.unitCount === 0
              ? 'floorNoUnits'
              : floor.rentedUnitCount === 0
                ? 'floorNotRented'
                : floor.rentedUnitCount === floor.unitCount
                  ? 'floorFullyRented'
                  : 'floorPartlyRented',
          )}
        </AppText>
        {rentals.map((rental) => (
          <View key={rental.tenancyId} style={styles.rental}>
            <AppText
              variant="label"
              style={
                /[\u0980-\u09ff]/.test(rental.unitName)
                  ? { fontFamily: fontFamilies.bn.medium }
                  : undefined
              }
            >
              {t('rentalUnitLabel', { name: rental.unitName })}
            </AppText>
            <AppText
              variant="label"
              style={
                /[\u0980-\u09ff]/.test(rental.tenantName)
                  ? { fontFamily: fontFamilies.bn.medium }
                  : undefined
              }
            >
              {t('rentedBy', { name: rental.tenantName })}
            </AppText>
          </View>
        ))}
        <View style={styles.open}>
          <AppText variant="label" color={colors.brand}>
            {t('viewUnits')}
          </AppText>
        </View>
      </Pressable>
      <EditButton
        label={t('editNamedFloor', { name: floor.name })}
        onPress={() => onEdit(floor)}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'flex-start', gap: 12, padding: 20 },
  rental: { gap: 4, paddingVertical: 4 },
  identity: { flex: 1, gap: 8 },
  open: { minHeight: 48, justifyContent: 'center' },
});
