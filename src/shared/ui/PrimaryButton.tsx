import { Pressable, StyleSheet } from 'react-native';
import { AppText } from './AppText';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';

export function PrimaryButton({
  label,
  onPress,
}: {
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        surfaces.control,
        styles.button,
        pressed && styles.pressed,
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
  label: { textAlign: 'center' },
  pressed: { opacity: 0.8 },
});
