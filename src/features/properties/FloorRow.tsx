import { Pressable, StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { fontFamilies } from '../../theme/typography';
import type { Floor } from './floorStore';

export function FloorRow({
  floor,
  onEdit,
  onOpen,
}: {
  floor: Floor;
  onEdit: (floor: Floor) => void;
  onOpen: () => void;
}) {
  const { t } = useLocale();
  return (
    <View style={[surfaces.card, styles.row]}>
      <Pressable style={styles.identity} accessibilityRole="button" accessibilityLabel={t('viewFloorUnits', { name: floor.name })} onPress={onOpen}>
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
        <View style={styles.open}>
          <AppText variant="label" color={colors.brand}>
            {t('viewUnits')}
          </AppText>
        </View>
      </Pressable>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('editNamedFloor', { name: floor.name })}
        onPress={() => onEdit(floor)}
        style={({ pressed }) => [styles.edit, pressed && { opacity: 0.75 }]}
      >
        <AppText variant="label" color={colors.brand}>
          {t('edit')}
        </AppText>
      </Pressable>
    </View>
  );
}
const styles = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20 },
  identity: { flex: 1 },
  open: { minHeight: 48, justifyContent: 'center' },
  edit: {
    minWidth: 76,
    minHeight: 52,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.selected,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
