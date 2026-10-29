import { Pressable, StyleSheet } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';

export function TenantLink({
  name,
  onPress,
}: {
  name: string;
  onPress: () => void;
}) {
  const { t } = useLocale();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('openTenantDetails', { name })}
      onPress={onPress}
      style={({ pressed }) => [styles.button, pressed && styles.pressed]}
    >
      <AppText
        variant="label"
        color={colors.brand}
        style={
          /[\u0980-\u09ff]/.test(name)
            ? { fontFamily: fontFamilies.bn.medium }
            : undefined
        }
      >
        {t('rentedBy', { name })}
      </AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 48,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 12,
    backgroundColor: colors.selected,
    alignSelf: 'flex-start',
    maxWidth: '100%',
    justifyContent: 'center',
  },
  pressed: { opacity: 0.75 },
});
