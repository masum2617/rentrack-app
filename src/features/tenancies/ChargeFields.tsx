import { useEffect, useRef } from 'react';
import { View, type TextInputInstance } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { FormField } from '../../shared/ui/FormField';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { BillChoice } from '../ledger/BillChoice';
import {
  chargeKinds,
  type ChargeKind,
  type ChargeSettingsInput,
  type ChargeError,
} from './chargeSettings';
import { chargeLabel } from './chargePresentation';

export function ChargeFields({
  input,
  onChange,
  disabled,
  error,
}: {
  input: ChargeSettingsInput;
  onChange: (input: ChargeSettingsInput) => void;
  disabled: boolean;
  error?: ChargeError;
}) {
  const { t } = useLocale();
  const water = useRef<TextInputInstance>(null),
    service = useRef<TextInputInstance>(null),
    gas = useRef<TextInputInstance>(null);
  useEffect(() => {
    if (error?.field === 'water') water.current?.focus();
    else if (error?.field === 'service') service.current?.focus();
    else if (error?.field === 'gas') gas.current?.focus();
  }, [error]);
  function set(kind: ChargeKind, amount: string) {
    onChange({ ...input, [kind]: { ...input[kind], amount } });
  }
  return (
    <View style={{ gap: 20 }}>
      {chargeKinds.map((kind) => (
        <View key={kind} style={{ gap: 12 }}>
          <BillChoice
            label={t('chargeMode', { name: t(chargeLabel(kind)) })}
            value={input[kind].mode}
            disabled={disabled}
            options={[
              { value: 'none', label: t('chargeNone') },
              { value: 'fixed', label: t('chargeFixed') },
              ...(kind === 'water'
                ? [{ value: 'manual', label: t('chargeManual') }]
                : []),
            ]}
            onChange={(mode) => {
              if (
                mode === 'none' ||
                mode === 'fixed' ||
                (kind === 'water' && mode === 'manual')
              )
                onChange({ ...input, [kind]: { ...input[kind], mode } });
            }}
          />
          {input[kind].mode === 'fixed' && (
            <FormField
              label={t('chargeFixedAmount', { name: t(chargeLabel(kind)) })}
              value={input[kind].amount}
              placeholder={t('chargeAmountPlaceholder')}
              editable={!disabled}
              keyboardType="decimal-pad"
              returnKeyType="done"
              inputRef={
                kind === 'water' ? water : kind === 'service' ? service : gas
              }
              error={error?.field === kind ? t('chargeAmountError') : undefined}
              onChangeText={(amount) => set(kind, amount)}
            />
          )}
        </View>
      ))}
      <AppText variant="label" color={colors.muted}>
        {t('chargeSettingsHint')}
      </AppText>
    </View>
  );
}
