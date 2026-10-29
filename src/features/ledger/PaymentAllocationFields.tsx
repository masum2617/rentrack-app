import { useEffect, useRef } from 'react';
import { View, type TextInputInstance } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { FormField } from '../../shared/ui/FormField';
import { formatPaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { chargeLabel } from '../tenancies/chargePresentation';
import { billMonth } from './billPresentation';
import type { DueLine, PaymentError } from './paymentValidation';

export function PaymentAllocationFields({
  line,
  amount,
  disabled,
  error,
  onChange,
}: {
  line: DueLine;
  amount: string;
  disabled: boolean;
  error?: PaymentError;
  onChange: (value: string) => void;
}) {
  const { t, locale } = useLocale();
  const input = useRef<TextInputInstance>(null);
  useEffect(() => {
    if (error) input.current?.focus();
  }, [error]);
  const name = line.kind === 'other' ? line.name : t(chargeLabel(line.kind));
  return (
    <View
      style={{
        gap: 10,
        paddingVertical: 12,
        borderBottomWidth: 1,
        borderColor: colors.line,
      }}
    >
      <AppText variant="heading">
        {billMonth(line.month, locale)} · {name}
      </AppText>
      <AppText color={colors.muted}>
        {t('paymentDue', {
          amount: formatPaisa(line.outstandingPaisa, locale),
        })}
      </AppText>
      <FormField
        label={t('paymentAllocation')}
        value={amount}
        placeholder="0"
        editable={!disabled}
        keyboardType="decimal-pad"
        returnKeyType="done"
        inputRef={input}
        error={error ? t('paymentAllocationError') : undefined}
        onChangeText={onChange}
      />
    </View>
  );
}
