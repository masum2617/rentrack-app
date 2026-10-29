import { useRef, useState } from 'react';
import { Alert, Modal, type TextInputInstance } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { FormField } from '../../shared/ui/FormField';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { formatPaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { RentalLocation } from '../tenancies/RentalLocation';
import { PaymentFormFrame } from './PaymentFormFrame';
import { paymentError } from './paymentPresentation';
import { reversePayment, type Payment } from './paymentStore';

export function PaymentReversalForm({
  payment,
  onClose,
  onSaved,
}: {
  payment: Payment;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t, locale, number } = useLocale();
  const [reason, setReason] = useState(''),
    [busy, setBusy] = useState(false),
    [blank, setBlank] = useState(false),
    [error, setError] = useState<unknown>();
  const field = useRef<TextInputInstance>(null),
    inFlight = useRef(false),
    confirming = useRef(false);
  function close() {
    if (inFlight.current) return;
    if (!reason) {
      onClose();
      return;
    }
    Alert.alert(t('unsavedHouse'), t('unsavedHouseBody'), [
      { text: t('keepEditing'), style: 'cancel' },
      { text: t('discardChanges'), style: 'destructive', onPress: onClose },
    ]);
  }
  async function save() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    setError(undefined);
    try {
      await reversePayment(await getDatabase(), payment.id, reason);
      onSaved();
    } catch (caught) {
      setError(caught);
      inFlight.current = false;
      setBusy(false);
    }
  }
  function confirm() {
    if (inFlight.current || confirming.current) return;
    if (!reason.trim()) {
      setBlank(true);
      field.current?.focus();
      return;
    }
    confirming.current = true;
    Alert.alert(
      t('paymentReverseTitle'),
      t('paymentReverseBody'),
      [
        {
          text: t('billCancel'),
          style: 'cancel',
          onPress: () => {
            confirming.current = false;
          },
        },
        {
          text: t('paymentReverse'),
          style: 'destructive',
          onPress: () => {
            confirming.current = false;
            void save();
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          confirming.current = false;
        },
      },
    );
  }
  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={close}
    >
      <PaymentFormFrame
        title={t('paymentReverse')}
        busy={busy}
        onBack={close}
        footer={
          <>
            {error !== undefined && (
              <AppText accessibilityRole="alert" color={colors.error}>
                {t(paymentError(error))}
              </AppText>
            )}
            <PrimaryButton
              label={t(busy ? 'savingHouse' : 'paymentReverse')}
              busy={busy}
              onPress={confirm}
            />
          </>
        }
      >
        <AppText>{t('paymentReference', { id: number(payment.id) })}</AppText>
        <RentalLocation
          propertyName={payment.propertyName}
          floorName={payment.floorName}
          unitName={payment.unitName}
        />
        <AppText>{payment.tenantName}</AppText>
        <AppText variant="heading">
          {formatPaisa(payment.amountPaisa, locale)}
        </AppText>
        <AppText>{t('paymentReverseBody')}</AppText>
        <FormField
          inputRef={field}
          label={t('paymentReverseReason')}
          value={reason}
          placeholder={t('paymentReversePlaceholder')}
          editable={!busy}
          multiline
          error={blank ? t('paymentReasonError') : undefined}
          onChangeText={(value) => {
            setReason(value);
            setBlank(false);
            setError(undefined);
          }}
        />
      </PaymentFormFrame>
    </Modal>
  );
}
