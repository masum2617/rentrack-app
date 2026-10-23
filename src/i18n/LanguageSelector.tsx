import { Pressable, StyleSheet, View } from 'react-native';
import { useLocale, type Locale } from './LocaleProvider';
import { AppText } from '../shared/ui/AppText';
import { AssetIcon } from '../shared/ui/AssetIcon';
import { colors } from '../theme/colors';
import { surfaces } from '../theme/surfaces';

function LanguageOption({
  value,
  label,
  fontFamily,
}: {
  value: Locale;
  label: string;
  fontFamily: string;
}) {
  const { locale, setLocale } = useLocale();
  const selected = value === locale;
  return (
    <Pressable
      key={value}
      accessibilityRole="radio"
      accessibilityState={{ checked: selected }}
      accessibilityLabel={label}
      onPress={() => setLocale(value)}
      style={[styles.option, selected && styles.selected]}
    >
      {selected ? <AssetIcon name="radio" /> : <View style={styles.radio} />}
      <AppText
        variant="label"
        color={selected ? colors.brand : colors.muted}
        style={{ fontFamily }}
      >
        {label}
      </AppText>
    </Pressable>
  );
}
export function LanguageSelector({ compact = true }: { compact?: boolean }) {
  const { t } = useLocale();
  return (
    <View
      accessibilityRole="radiogroup"
      accessibilityLabel={t('language')}
      style={[
        surfaces.control,
        styles.group,
        compact ? styles.compact : styles.expanded,
      ]}
    >
      <LanguageOption value="bn" label="বাংলা" fontFamily="BengaliMedium" />
      <LanguageOption value="en" label="English" fontFamily="EnglishMedium" />
    </View>
  );
}
const styles = StyleSheet.create({
  group: { flexDirection: 'row' },
  compact: { width: 180 },
  expanded: { alignSelf: 'stretch' },
  option: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minHeight: 48,
    paddingHorizontal: 6,
    paddingVertical: 8,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  selected: { backgroundColor: colors.selected, borderColor: colors.brand },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.muted,
  },
});
