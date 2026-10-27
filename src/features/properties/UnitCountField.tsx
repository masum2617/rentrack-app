import type { RefObject } from 'react';
import { Pressable, StyleSheet, TextInput, View, useWindowDimensions, type TextInputInstance } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import { parseUnitCount } from './unitValidation';

export function UnitCountField({ label, value, onChangeText, editable, error, inputRef }: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  editable: boolean;
  error?: string;
  inputRef: RefObject<TextInputInstance | null>;
}) {
  const { t, locale } = useLocale();
  const { width, fontScale } = useWindowDimensions();
  const stacked = width < 360 || fontScale > 1.3;
  const count = parseUnitCount(value || '0');
  function change(delta: number) {
    if (count === undefined || !Number.isSafeInteger(count + delta) || count + delta < 0) return;
    const next = String(count + delta);
    onChangeText(locale === 'bn' ? next.replace(/[0-9]/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]) : next);
  }
  return <View style={styles.field}>
    <View style={[styles.row, stacked && styles.stacked]}>
      <AppText variant="label" style={[styles.label, stacked && { flex: 0 }]}>{label}</AppText>
      <View style={styles.controls}>
        <Pressable accessibilityRole="button" accessibilityLabel={t('decreaseCount', { label })} disabled={!editable || count === undefined || count === 0} accessibilityState={{ disabled: !editable || count === undefined || count === 0 }} onPress={() => change(-1)} style={styles.step}><AppText>−</AppText></Pressable>
        <TextInput ref={inputRef} accessibilityLabel={label} accessibilityHint={error} value={value} onChangeText={onChangeText} editable={editable} keyboardType="number-pad" returnKeyType="done" selectTextOnFocus selectionColor={colors.brand}
          style={[styles.input, { fontFamily: fontFamilies[locale].regular }, error && styles.invalid]} />
        <Pressable accessibilityRole="button" accessibilityLabel={t('increaseCount', { label })} disabled={!editable || count === undefined || count === Number.MAX_SAFE_INTEGER} accessibilityState={{ disabled: !editable || count === undefined || count === Number.MAX_SAFE_INTEGER }} onPress={() => change(1)} style={styles.step}><AppText>+</AppText></Pressable>
      </View>
    </View>
    {error && <AppText accessibilityRole="alert" variant="label" color={colors.error}>{error}</AppText>}
  </View>;
}
const styles = StyleSheet.create({
  field: { gap: 8, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: colors.line },
  row: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stacked: { flexDirection: 'column', alignItems: 'stretch' },
  label: { flex: 1 },
  controls: { flexDirection: 'row', gap: 4, alignItems: 'center' },
  step: { width: 52, minHeight: 56, backgroundColor: colors.selected, borderRadius: 12, alignItems: 'center', justifyContent: 'center' },
  input: { width: 72, minHeight: 56, borderWidth: 1, borderColor: colors.inputBoundary, borderRadius: 12, textAlign: 'center', fontSize: 18, color: colors.ink, padding: 8 },
  invalid: { borderColor: colors.error, borderWidth: 2 },
});
