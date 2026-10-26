import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';

export function PrimaryButton({
  label,
  onPress,
  disabled = false,
  busy = false,
}: {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  busy?: boolean;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: disabled || busy, busy }}
      disabled={disabled || busy}
      onPress={onPress}
      style={({ pressed }) => [
        surfaces.control,
        styles.button,
        pressed && styles.pressed,
        (disabled || busy) && styles.pressed,
      ]}
    >
      <AppText variant="body" color={colors.surface} style={styles.label}>
        {label}
      </AppText>
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    minHeight: 56,
    borderRadius: 20,
    backgroundColor: colors.brand,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'stretch',
  },
  label: { textAlign: 'center', alignSelf: 'stretch' },
  pressed: { opacity: 0.8 },
});
