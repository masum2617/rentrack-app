import { useState, type RefObject, type ComponentRef } from 'react';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { colors } from '../../theme/colors';

export function BillChoice({
  label,
  value,
  options,
  onChange,
  disabled = false,
  controlRef,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
  disabled?: boolean;
  controlRef?: RefObject<ComponentRef<typeof View> | null>;
}) {
  const { t } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <Pressable
        ref={controlRef}
        accessibilityRole="button"
        accessibilityLabel={t('billSelect', { label })}
        accessibilityValue={{
          text: options.find((item) => item.value === value)?.label ?? value,
        }}
        accessibilityState={{ expanded: open, disabled }}
        disabled={disabled}
        onPress={() => setOpen((current) => !current)}
        style={styles.control}
      >
        <AppText style={styles.grow}>
          {options.find((item) => item.value === value)?.label ?? value}
        </AppText>
        <AssetIcon name="down" />
      </Pressable>
      {open && (
        <ScrollView
          nestedScrollEnabled
          keyboardShouldPersistTaps="handled"
          style={styles.options}
        >
          {options.map((item) => (
            <Pressable
              key={item.value}
              disabled={disabled}
              accessibilityRole="radio"
              accessibilityState={{ checked: value === item.value, disabled }}
              onPress={() => {
                setOpen(false);
                onChange(item.value);
              }}
              style={[styles.option, item.value === value && styles.selected]}
            >
              <AppText>{item.label}</AppText>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  field: { gap: 8 },
  control: {
    minHeight: 56,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.inputBoundary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  grow: { flex: 1 },
  options: {
    maxHeight: 240,
    borderWidth: 1,
    borderRadius: 12,
    borderColor: colors.line,
  },
  option: { minHeight: 52, padding: 12, justifyContent: 'center' },
  selected: { backgroundColor: colors.selected },
});
