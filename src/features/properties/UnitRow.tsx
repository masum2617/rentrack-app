import { Pressable, StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { fontFamilies } from '../../theme/typography';
import type { Unit } from './unitStore';

export function UnitRow({ unit, onEdit }: { unit: Unit; onEdit: (unit: Unit) => void }) {
  const { t, number } = useLocale();
  return <View style={[surfaces.card, styles.row]}>
    <View style={styles.top}>
      <AppText variant="heading" style={[styles.name, /[\u0980-\u09ff]/.test(unit.name) && { fontFamily: fontFamilies.bn.semibold }]}>{unit.name}</AppText>
      <Pressable accessibilityRole="button" accessibilityLabel={t('editNamedUnit', { name: unit.name })} onPress={() => onEdit(unit)} style={({ pressed }) => [styles.edit, pressed && { opacity: 0.75 }]}><AppText variant="label" color={colors.brand}>{t('edit')}</AppText></Pressable>
    </View>
    <AppText color={unit.sizeSqFt === undefined ? colors.muted : colors.brand}>{unit.sizeSqFt === undefined ? t('unitSizeUnknown') : t('unitArea', { size: number(unit.sizeSqFt) })}</AppText>
    <AppText variant="label" color={colors.muted}>{t('unitRoomSummary', { bedrooms: number(unit.bedrooms), drawing: number(unit.drawingRooms) })}</AppText>
    <AppText variant="label" color={colors.muted}>{t('unitBathroomSummary', { total: number(unit.totalBathrooms), attached: number(unit.attachedBathrooms) })}</AppText>
    <AppText variant="label" color={colors.muted}>{t('unitBalconySummary', { count: number(unit.balconies) })}</AppText>
    {unit.notes ? <View style={styles.notes}><AppText variant="label">{t('unitNotesHeading')}</AppText><AppText variant="label" color={colors.muted} style={/[\u0980-\u09ff]/.test(unit.notes) ? { fontFamily: fontFamilies.bn.medium } : undefined}>{unit.notes}</AppText></View> : undefined}
  </View>;
}
const styles = StyleSheet.create({
  row: { padding: 20, gap: 12 }, top: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { flex: 1 }, edit: { minWidth: 76, minHeight: 52, padding: 12, alignItems: 'center', justifyContent: 'center', borderRadius: 12, backgroundColor: colors.selected },
  notes: { gap: 4, borderTopWidth: 1, borderTopColor: colors.line, paddingTop: 12 },
});
