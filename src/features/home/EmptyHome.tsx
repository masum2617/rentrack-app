import { StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';

export function EmptyHome({ onAdd }: { onAdd: () => void }) {
  const { t } = useLocale();
  return (
    <View style={styles.content}>
      <View style={[surfaces.card, styles.introduction]}>
        <View style={styles.icon}>
          <AssetIcon name="emptyHome" />
        </View>
        <AppText variant="heading">{t('firstProperty')}</AppText>
        <AppText color={colors.muted}>{t('firstDescription')}</AppText>
        <PrimaryButton label={t('addProperty')} onPress={onAdd} />
      </View>
      <AppText accessibilityRole="header" variant="heading">
        {t('setup')}
      </AppText>
      <AppText color={colors.muted}>{t('setupProperty')}</AppText>
      <AppText color={colors.muted}>{t('setupUnits')}</AppText>
      <AppText color={colors.muted}>{t('setupTenant')}</AppText>
      <AppText variant="meta" color={colors.muted}>
        {t('emptyNote')}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  content: { gap: 16 },
  introduction: { gap: 16, padding: 20 },
  icon: {
    width: 56,
    height: 56,
    backgroundColor: colors.selected,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
