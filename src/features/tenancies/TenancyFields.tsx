import { useEffect, useRef, useState, type ComponentRef } from 'react';
import {
  Platform,
  Pressable,
  StyleSheet,
  View,
  type TextInputInstance,
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { FormField } from '../../shared/ui/FormField';
import { colors } from '../../theme/colors';
import {
  calendarDate,
  dateForPicker,
  localDate,
  type TenancyErrors,
  type TenancyField,
  type TenancyInput,
} from './tenancyValidation';

export function TenancyFields({
  input,
  errors,
  editable,
  onChange,
  focusRequest,
}: {
  input: TenancyInput;
  errors: TenancyErrors;
  editable: boolean;
  focusRequest: number;
  onChange: (field: TenancyField, value: string) => void;
}) {
  const { t, locale } = useLocale();
  const [picker, setPicker] = useState(false);
  const lastFocusRequest = useRef(-1);
  const dateButton = useRef<ComponentRef<typeof View>>(null);
  const rent = useRef<TextInputInstance>(null),
    due = useRef<TextInputInstance>(null);
  const notice = useRef<TextInputInstance>(null),
    advance = useRef<TextInputInstance>(null);
  useEffect(() => {
    // Clearing an error while typing must not move focus to another field.
    if (lastFocusRequest.current === focusRequest) return;
    lastFocusRequest.current = focusRequest;
    if (errors.startDate) dateButton.current?.focus();
    else if (errors.rent) rent.current?.focus();
    else if (errors.dueDay) due.current?.focus();
    else if (errors.noticeMonths) notice.current?.focus();
    else if (errors.agreedAdvance) advance.current?.focus();
  }, [errors, focusRequest]);
  const date = calendarDate(input.startDate)
    ? dateForPicker(input.startDate)
    : new Date();
  const formattedDate = new Intl.DateTimeFormat(
    locale === 'bn' ? 'bn-BD' : 'en-GB',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      calendar: 'gregory',
    },
  ).format(date);
  return (
    <View style={styles.fields}>
      <View style={styles.dateField}>
        <AppText variant="label">{t('tenancyStartDate')} *</AppText>
        <Pressable
          ref={dateButton}
          accessibilityRole="button"
          accessibilityLabel={t('tenancyStartDate')}
          accessibilityValue={{ text: formattedDate }}
          accessibilityHint={t(
            errors.startDate ? 'tenancyDateError' : 'tenancyDateHint',
          )}
          disabled={!editable}
          onPress={() => setPicker(true)}
          style={[styles.date, errors.startDate && styles.invalid]}
        >
          <AppText>{formattedDate}</AppText>
        </Pressable>
        <AppText variant="label" color={colors.muted}>
          {t('tenancyDateHint')}
        </AppText>
        {errors.startDate && (
          <AppText accessibilityRole="alert" color={colors.error}>
            {t('tenancyDateError')}
          </AppText>
        )}
        {picker && (
          <>
            <DateTimePicker
              value={date}
              mode="date"
              display={Platform.OS === 'ios' ? 'inline' : 'default'}
              maximumDate={new Date()}
              onChange={(_, selected) => {
                if (Platform.OS === 'android') setPicker(false);
                if (selected) onChange('startDate', localDate(selected));
              }}
            />
            {Platform.OS === 'ios' && (
              <Pressable
                accessibilityRole="button"
                onPress={() => setPicker(false)}
                style={styles.done}
              >
                <AppText color={colors.brand}>{t('tenancyDateDone')}</AppText>
              </Pressable>
            )}
          </>
        )}
      </View>
      <FormField
        label={`${t('tenancyRent')} *`}
        value={input.rent}
        placeholder={t('tenancyRentExample')}
        editable={editable}
        keyboardType="decimal-pad"
        inputRef={rent}
        error={errors.rent ? t('tenancyRentError') : undefined}
        onChangeText={(v) => onChange('rent', v)}
        onSubmitEditing={() => due.current?.focus()}
      />
      <FormField
        label={`${t('tenancyDueDay')} *`}
        value={input.dueDay}
        placeholder={t('tenancyDueExample')}
        editable={editable}
        keyboardType="number-pad"
        inputRef={due}
        error={errors.dueDay ? t('tenancyDueError') : undefined}
        onChangeText={(v) => onChange('dueDay', v)}
        onSubmitEditing={() => notice.current?.focus()}
      />
      <AppText variant="label" color={colors.muted}>
        {t('tenancyDueHint')}
      </AppText>
      <FormField
        label={`${t('tenancyNotice')} *`}
        value={input.noticeMonths}
        placeholder={t('tenancyNoticeExample')}
        editable={editable}
        keyboardType="number-pad"
        inputRef={notice}
        error={errors.noticeMonths ? t('tenancyNoticeError') : undefined}
        onChangeText={(v) => onChange('noticeMonths', v)}
        onSubmitEditing={() => advance.current?.focus()}
      />
      <FormField
        label={`${t('tenancyAgreedAdvance')} *`}
        value={input.agreedAdvance}
        placeholder={t('tenancyAdvanceExample')}
        editable={editable}
        keyboardType="decimal-pad"
        inputRef={advance}
        returnKeyType="done"
        error={errors.agreedAdvance ? t('tenancyAdvanceError') : undefined}
        onChangeText={(v) => onChange('agreedAdvance', v)}
      />
      <AppText variant="label" color={colors.muted}>
        {t('tenancyAdvanceHint')}
      </AppText>
    </View>
  );
}
const styles = StyleSheet.create({
  fields: { gap: 20 },
  dateField: { gap: 8 },
  date: {
    minHeight: 60,
    borderWidth: 1,
    borderColor: colors.inputBoundary,
    padding: 16,
    borderRadius: 12,
  },
  invalid: { borderColor: colors.error, borderWidth: 2 },
  done: { minHeight: 48, justifyContent: 'center' },
});
