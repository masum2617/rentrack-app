import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from 'react';
import { Pressable, View, type TextInputInstance } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { FormField } from '../../shared/ui/FormField';
import { formatPaisa, parsePaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import type { ChargeVersion } from '../tenancies/chargeSettings';
import { chargeLabel } from '../tenancies/chargePresentation';
import {
  ExtraError,
  prepareExtras,
  type ExtraInput,
} from './additionalCharges';

export type ExtraFieldsHandle = { validate: () => boolean };
export function BillExtraFields({
  input,
  version,
  disabled,
  onChange,
  ref,
}: {
  input: ExtraInput[];
  version?: ChargeVersion;
  disabled: boolean;
  onChange: (input: ExtraInput[]) => void;
  ref: Ref<ExtraFieldsHandle>;
}) {
  const { t } = useLocale();
  const [error, setError] = useState<ExtraError>();
  const sequence = useRef(0);
  useImperativeHandle(ref, () => ({
    validate() {
      try {
        prepareExtras(input, version);
        setError(undefined);
        return true;
      } catch (caught) {
        if (caught instanceof ExtraError) {
          setError(caught);
          return false;
        }
        throw caught;
      }
    },
  }));
  function update(next: ExtraInput[]) {
    setError(undefined);
    onChange(next);
  }
  return (
    <View style={{ gap: 20 }}>
      <AppText variant="heading" accessibilityRole="header">
        {t('chargeAdditional')}
      </AppText>
      {input.map((item, index) => (
        <ExtraField
          key={item.key}
          input={item}
          version={version}
          disabled={disabled}
          error={error?.index === index ? error : undefined}
          onChange={(next) =>
            update(input.map((old, i) => (i === index ? next : old)))
          }
          onRemove={() => update(input.filter((_, i) => i !== index))}
        />
      ))}
      <Pressable
        disabled={disabled}
        accessibilityRole="button"
        onPress={() => {
          sequence.current += 1;
          update([
            ...input,
            {
              key: `new-${sequence.current}`,
              kind: 'other',
              name: '',
              amount: '',
              reason: '',
            },
          ]);
        }}
        style={[
          surfaces.control,
          { minHeight: 52, padding: 12, alignItems: 'center' },
        ]}
      >
        <AppText color={colors.brand}>{t('chargeAdd')}</AppText>
      </Pressable>
    </View>
  );
}
function ExtraField({
  input,
  version,
  disabled,
  error,
  onChange,
  onRemove,
}: {
  input: ExtraInput;
  version?: ChargeVersion;
  disabled: boolean;
  error?: ExtraError;
  onChange: (input: ExtraInput) => void;
  onRemove: () => void;
}) {
  const { t, locale } = useLocale();
  const name =
    input.kind === 'other'
      ? input.name || t('chargeOther')
      : t(chargeLabel(input.kind));
  const setting =
    input.kind === 'other' ? undefined : version?.settings[input.kind];
  const overridden =
    setting?.mode === 'fixed' &&
    parsePaisa(input.amount) !== setting.amountPaisa;
  const nameRef = useRef<TextInputInstance>(null),
    amountRef = useRef<TextInputInstance>(null),
    reasonRef = useRef<TextInputInstance>(null);
  useEffect(() => {
    if (error?.field === 'name') nameRef.current?.focus();
    else if (error?.field === 'amount') amountRef.current?.focus();
    else if (error?.field === 'reason') reasonRef.current?.focus();
  }, [error]);
  return (
    <View style={[surfaces.card, { padding: 16, gap: 16 }]}>
      <AppText variant="heading">{name}</AppText>
      {input.kind === 'other' && (
        <FormField
          label={t('chargeName')}
          value={input.name}
          placeholder={t('chargeNamePlaceholder')}
          editable={!disabled}
          inputRef={nameRef}
          error={error?.field === 'name' ? t('chargeNameError') : undefined}
          onChangeText={(value) => onChange({ ...input, name: value })}
        />
      )}
      {setting?.mode === 'fixed' && (
        <AppText color={colors.muted}>
          {t('chargeProposed', {
            amount: formatPaisa(setting.amountPaisa, locale),
          })}
        </AppText>
      )}
      <FormField
        label={t('chargeAmount', { name })}
        value={input.amount}
        placeholder={t('chargeAmountPlaceholder')}
        editable={!disabled}
        keyboardType="decimal-pad"
        returnKeyType="done"
        inputRef={amountRef}
        error={error?.field === 'amount' ? t('chargeAmountError') : undefined}
        onChangeText={(value) => onChange({ ...input, amount: value })}
      />
      {setting?.mode === 'manual' && (
        <AppText variant="label" color={colors.muted}>
          {t('chargeEnterZero')}
        </AppText>
      )}
      {overridden && (
        <FormField
          label={t('billReason')}
          value={input.reason}
          placeholder={t('chargeReasonPlaceholder')}
          editable={!disabled}
          multiline
          inputRef={reasonRef}
          error={error?.field === 'reason' ? t('chargeReasonError') : undefined}
          onChangeText={(value) => onChange({ ...input, reason: value })}
        />
      )}
      {input.kind === 'other' && (
        <Pressable
          disabled={disabled}
          accessibilityRole="button"
          onPress={onRemove}
          style={[surfaces.control, { minHeight: 48, padding: 12 }]}
        >
          <AppText color={colors.error}>{t('chargeRemove', { name })}</AppText>
        </Pressable>
      )}
    </View>
  );
}
