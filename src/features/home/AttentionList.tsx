import { Pressable, StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon, type IconName } from '../../shared/ui/AssetIcon';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';

function AttentionRow({
  icon,
  title,
  detail,
  onPress,
}: {
  icon: IconName;
  title: string;
  detail: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [styles.row, pressed && styles.pressed]}
    >
      <View style={styles.icon}>
        <AssetIcon name={icon} />
      </View>
      <View style={styles.description}>
        <AppText>{title}</AppText>
        <AppText variant="meta" color={colors.muted}>
          {detail}
        </AppText>
      </View>
      <AssetIcon name="right" />
    </Pressable>
  );
}
export function AttentionList({
  readings,
  drafts,
  onPress,
}: {
  readings: number;
  drafts: number;
  onPress: () => void;
}) {
  const { t, number } = useLocale();
  return (
    <View style={styles.section}>
      <AppText accessibilityRole="header" variant="heading">
        {t('attention')}
      </AppText>
      <View style={[surfaces.card, styles.group]}>
        <AttentionRow
          icon="meter"
          title={t('readings')}
          detail={t(readings === 1 ? 'readingOne' : 'readingCount', {
            count: number(readings),
          })}
          onPress={onPress}
        />
        <View style={styles.divider} />
        <AttentionRow
          icon="bill"
          title={t('bills')}
          detail={t(drafts === 1 ? 'draftOne' : 'draftCount', {
            count: number(drafts),
          })}
          onPress={onPress}
        />
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  section: { gap: 8 },
  group: { padding: 0 },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    minHeight: 74,
    padding: 12,
  },
  icon: {
    width: 32,
    height: 36,
    borderRadius: 8,
    backgroundColor: colors.selected,
    alignItems: 'center',
    justifyContent: 'center',
  },
  description: { flex: 1 },
  divider: { height: 1, backgroundColor: colors.line },
  pressed: { opacity: 0.7 },
});
