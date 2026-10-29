import { Pressable, StyleSheet } from 'react-native';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { AssetIcon } from './AssetIcon';

export function EditButton({
  label,
  onPress,
  disabled = false,
}: {
  disabled?: boolean;
  label: string;
  onPress: () => void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
      style={({ pressed }) => [
        surfaces.control,
        styles.button,
        (pressed || disabled) && styles.pressed,
      ]}
    >
      <AssetIcon name="edit" tint={colors.brand} />
    </Pressable>
  );
}
const styles = StyleSheet.create({
  button: {
    width: 52,
    minHeight: 52,
    flexShrink: 0,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.selected,
  },
  pressed: { opacity: 0.75 },
});
