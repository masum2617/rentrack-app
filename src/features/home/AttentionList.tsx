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
  overdue,
  drafts,
  onOverdue,
  onDrafts,
}: {
  overdue: number;
  drafts: number;
  onOverdue: () => void;
  onDrafts: () => void;
}) {
  const { t, number } = useLocale();
  return (
    <View style={styles.section}>
      <AppText accessibilityRole="header" variant="heading">
        {t('attention')}
      </AppText>
      <View style={[surfaces.card, styles.group]}>
        <AttentionRow
          icon="ledger"
          title={t('homeOverdue')}
          detail={t('homeOverdueCount', {
            count: number(overdue),
          })}
          onPress={onOverdue}
        />
        <View style={styles.divider} />
        <AttentionRow
          icon="bill"
          title={t('homeDrafts')}
          detail={t('homeDraftCount', {
            count: number(drafts),
          })}
          onPress={onDrafts}
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
