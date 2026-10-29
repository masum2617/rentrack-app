import { TenantLink } from '../tenants/TenantLink';
import { EditButton } from '../../shared/ui/EditButton';
import { Pressable, StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { fontFamilies } from '../../theme/typography';
import type { Unit } from './unitStore';

export function UnitRow({
  unit,
  onEdit,
  onOpen,
  showOccupancy = false,
  occupant,
  onOpenTenant,
}: {
  unit: Unit;
  onEdit: (unit: Unit) => void;
  onOpen?: () => void;
  showOccupancy?: boolean;
  occupant?: { tenantId: number; tenantName: string };
  onOpenTenant?: (tenantId: number) => void;
}) {
  const { t, number } = useLocale();
  return (
    <View style={[surfaces.card, styles.row]}>
      <View style={styles.top}>
        <Pressable
          accessibilityRole={onOpen ? 'button' : undefined}
          accessibilityLabel={
            onOpen ? t('openUnit', { name: unit.name }) : undefined
          }
          disabled={!onOpen}
          onPress={onOpen}
          style={[styles.name, styles.open]}
        >
          <AppText
            variant="heading"
            style={
              /[\u0980-\u09ff]/.test(unit.name)
                ? { fontFamily: fontFamilies.bn.semibold }
                : undefined
            }
          >
            {unit.name}
          </AppText>
          {onOpen && (
            <AppText variant="label" color={colors.brand}>
              {t('viewUnit')}
            </AppText>
          )}
        </Pressable>
        <EditButton
          label={t('editNamedUnit', { name: unit.name })}
          onPress={() => onEdit(unit)}
        />
      </View>
      {showOccupancy && (
        <View style={styles.occupancy}>
          {occupant ? (
            onOpenTenant ? (
              <TenantLink
                name={occupant.tenantName}
                onPress={() => onOpenTenant(occupant.tenantId)}
              />
            ) : (
              <AppText variant="label" color={colors.brand}>
                {t('rentedBy', { name: occupant.tenantName })}
              </AppText>
            )
          ) : (
            <AppText variant="label" color={colors.brand}>
              {t('unitVacant')}
            </AppText>
          )}
        </View>
      )}
      <AppText
        color={unit.sizeSqFt === undefined ? colors.muted : colors.brand}
      >
        {unit.sizeSqFt === undefined
          ? t('unitSizeUnknown')
          : t('unitArea', { size: number(unit.sizeSqFt) })}
      </AppText>
      <AppText variant="label" color={colors.muted}>
        {t('unitRoomSummary', {
          bedrooms: number(unit.bedrooms),
          drawing: number(unit.drawingRooms),
        })}
      </AppText>
      <AppText variant="label" color={colors.muted}>
        {t('unitBathroomSummary', {
          total: number(unit.totalBathrooms),
          attached: number(unit.attachedBathrooms),
        })}
      </AppText>
      <AppText variant="label" color={colors.muted}>
        {t('unitBalconySummary', { count: number(unit.balconies) })}
      </AppText>
      {unit.notes ? (
        <View style={styles.notes}>
          <AppText variant="label">{t('unitNotesHeading')}</AppText>
          <AppText
            variant="label"
            color={colors.muted}
            style={
              /[\u0980-\u09ff]/.test(unit.notes)
                ? { fontFamily: fontFamilies.bn.medium }
                : undefined
            }
          >
            {unit.notes}
          </AppText>
        </View>
      ) : undefined}
    </View>
  );
}
const styles = StyleSheet.create({
  row: { padding: 20, gap: 12 },
  top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  open: { minHeight: 48, justifyContent: 'center', gap: 4 },
  occupancy: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    columnGap: 12,
    rowGap: 4,
  },
  name: { flex: 1 },
  notes: {
    gap: 4,
    borderTopWidth: 1,
    borderTopColor: colors.line,
    paddingTop: 12,
  },
});
