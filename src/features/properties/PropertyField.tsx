import { useState, type RefObject } from 'react';
import {
  StyleSheet,
  TextInput,
  View,
  type TextInputInstance,
} from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';

export function PropertyField({
  label,
  value,
  placeholder,
  onChangeText,
  inputRef,
  error,
  multiline = false,
  editable,
  onSubmitEditing,
}: {
  label: string;
  value: string;
  placeholder: string;
  onChangeText: (value: string) => void;
  inputRef?: RefObject<TextInputInstance | null>;
  error?: string;
  multiline?: boolean;
  editable: boolean;
  onSubmitEditing?: () => void;
}) {
  const { locale } = useLocale();
  const [focused, setFocused] = useState(false);
  const fontLocale = /[\u0980-\u09ff]/.test(value) ? 'bn' : locale;
  return (
    <View style={styles.field}>
      <AppText variant="label">{label}</AppText>
      <TextInput
        ref={inputRef}
        accessibilityLabel={label}
        accessibilityHint={error}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.muted}
        editable={editable}
        multiline={multiline}
        textAlignVertical={multiline ? 'top' : 'center'}
        returnKeyType={multiline ? 'default' : 'next'}
        submitBehavior={multiline ? 'newline' : 'submit'}
        onSubmitEditing={onSubmitEditing}
        selectionColor={colors.brand}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={[
          styles.input,
          { fontFamily: fontFamilies[fontLocale].regular },
          multiline && styles.multiline,
          focused && styles.focused,
          error && styles.invalid,
        ]}
      />
      {error && (
        <AppText variant="label" color={colors.error} accessibilityRole="alert">
          {error}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { gap: 8 },
  input: {
    minHeight: 60,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.inputBoundary,
    borderRadius: 12,
    color: colors.ink,
    backgroundColor: colors.surface,
    fontSize: 18,
  },
  multiline: { minHeight: 112 },
  focused: { borderColor: colors.brand, borderWidth: 2 },
  invalid: { borderColor: colors.error, borderWidth: 2 },
});
