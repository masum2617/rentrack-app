import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../i18n/LocaleProvider';
import { LanguageSelector } from '../i18n/LanguageSelector';
import { AppText } from '../shared/ui/AppText';
import { PrimaryButton } from '../shared/ui/PrimaryButton';
import { colors } from '../theme/colors';
import { surfaces } from '../theme/surfaces';

type Props = {
  title: string;
  onHome: () => void;
  empty?: boolean;
  onPreviewChange?: (empty: boolean) => void;
};
export function UnavailableScreen({
  title,
  onHome,
  empty,
  onPreviewChange,
}: Props) {
  const { t } = useLocale();
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <AppText accessibilityRole="header" variant="title">
          {title}
        </AppText>
        <LanguageSelector compact={false} />
        <View style={[surfaces.card, styles.card]}>
          <AppText variant="heading">{t('unavailable')}</AppText>
          <AppText color={colors.muted}>{t('sectionBody')}</AppText>
          <PrimaryButton label={t('backHome')} onPress={onHome} />
        </View>
        {__DEV__ && onPreviewChange && (
          <View style={[surfaces.card, styles.card]}>
            <AppText variant="heading">{t('preview')}</AppText>
            <AppText variant="meta" color={colors.muted}>
              {t('previewNote')}
            </AppText>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: !empty }}
              onPress={() => onPreviewChange(false)}
              style={[styles.option, !empty && styles.selected]}
            >
              <AppText variant="label">{t('populated')}</AppText>
            </Pressable>
            <Pressable
              accessibilityRole="radio"
              accessibilityState={{ checked: !!empty }}
              onPress={() => onPreviewChange(true)}
              style={[styles.option, empty && styles.selected]}
            >
              <AppText variant="label">{t('empty')}</AppText>
            </Pressable>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { padding: 20, paddingBottom: 44, gap: 20 },
  card: { gap: 16 },
  option: {
    minHeight: 48,
    padding: 12,
    borderWidth: 1,
    borderColor: colors.line,
    borderRadius: 12,
  },
  selected: { backgroundColor: colors.selected, borderColor: colors.brand },
});
