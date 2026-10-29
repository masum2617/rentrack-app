import { useState, type RefObject, type ComponentRef } from 'react';
import { Platform, Pressable, View } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { dateForPicker, localDate } from '../tenancies/tenancyValidation';
import { billDate } from './billPresentation';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';

export function PaymentDateField({
  value,
  disabled,
  error,
  onChange,
  controlRef,
}: {
  value: string;
  disabled: boolean;
  error?: string;
  onChange: (value: string) => void;
  controlRef: RefObject<ComponentRef<typeof View> | null>;
}) {
  const { t, locale } = useLocale();
  const [open, setOpen] = useState(false);
  return (
    <View style={{ gap: 8 }}>
      <AppText variant="label">{t('paymentDate')}</AppText>
      <Pressable
        ref={controlRef}
        accessibilityRole="button"
        accessibilityLabel={t('paymentDate')}
        accessibilityHint={error}
        accessibilityValue={{ text: billDate(value, locale) }}
        disabled={disabled}
        onPress={() => setOpen(true)}
        style={[surfaces.control, { minHeight: 56, padding: 12 }]}
      >
        <AppText>{billDate(value, locale)}</AppText>
      </Pressable>
      {error && (
        <AppText accessibilityRole="alert" color={colors.error}>
          {error}
        </AppText>
      )}
      {open && (
        <>
          <DateTimePicker
            value={dateForPicker(value)}
            maximumDate={new Date()}
            mode="date"
            display={Platform.OS === 'ios' ? 'inline' : 'default'}
            onChange={(event, date) => {
              if (Platform.OS !== 'ios') setOpen(false);
              if (event.type !== 'dismissed' && date) onChange(localDate(date));
            }}
          />
          {Platform.OS === 'ios' && (
            <Pressable
              accessibilityRole="button"
              onPress={() => setOpen(false)}
              style={[surfaces.control, { minHeight: 48, padding: 12 }]}
            >
              <AppText>{t('saveHouse')}</AppText>
            </Pressable>
          )}
        </>
      )}
    </View>
  );
}
