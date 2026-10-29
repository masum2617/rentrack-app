import { useEffect, useState } from 'react';
import { ActivityIndicator, AppState } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useLocale } from '../../i18n/LocaleProvider';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { formatPaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { RentalLocation } from '../tenancies/RentalLocation';
import { chargeLabel } from '../tenancies/chargePresentation';
import { billDate, billMonth } from './billPresentation';
import { PaymentFormFrame } from './PaymentFormFrame';
import { methodLabel } from './paymentPresentation';
import {
  getPayment,
  receiptAllocations,
  type Payment,
  type ReceiptAllocation,
} from './paymentStore';
import { PaymentReversalForm } from './PaymentReversalForm';

type State =
  | { status: 'loading' | 'error' | 'missing' }
  | { status: 'ready'; payment: Payment; allocations: ReceiptAllocation[] };
export function PaymentReceiptScreen({
  paymentId,
  revision,
  onBack,
  onChanged,
}: {
  paymentId: number;
  revision: number;
  onBack: () => void;
  onChanged: () => void;
}) {
  const { t, locale, number } = useLocale(),
    focused = useIsFocused();
  const [state, setState] = useState<State>({ status: 'loading' }),
    [attempt, setAttempt] = useState(0),
    [reversing, setReversing] = useState(false);
  useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      if (status === 'active') setAttempt((n) => n + 1);
    });
    return () => listener.remove();
  }, []);
  useEffect(() => {
    if (!focused) return;
    let active = true;
    async function load() {
      try {
        const db = await getDatabase();
        const [payment, allocations] = await Promise.all([
          getPayment(db, paymentId),
          receiptAllocations(db, paymentId),
        ]);
        if (active)
          setState(
            payment
              ? { status: 'ready', payment, allocations }
              : { status: 'missing' },
          );
      } catch {
        if (active) setState({ status: 'error' });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [paymentId, revision, attempt, focused]);
  function time(value: string) {
    return new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
      dateStyle: 'medium',
      timeStyle: 'short',
      calendar: 'gregory',
    }).format(new Date(value));
  }
  return (
    <>
      <PaymentFormFrame
        title={t('paymentReceipt')}
        busy={false}
        onBack={onBack}
      >
        {state.status === 'ready' ? (
          <>
            <AppText>
              {t('paymentReference', { id: number(state.payment.id) })}
            </AppText>
            <AppText
              accessibilityLiveRegion="polite"
              color={
                state.payment.status === 'reversed'
                  ? colors.error
                  : colors.brand
              }
            >
              {t(
                state.payment.status === 'reversed'
                  ? 'paymentReversed'
                  : 'paymentRecorded',
              )}
            </AppText>
            <RentalLocation
              propertyName={state.payment.propertyName}
              floorName={state.payment.floorName}
              unitName={state.payment.unitName}
            />
            <AppText>{state.payment.tenantName}</AppText>
            <AppText variant="label">{t('paymentReceived')}</AppText>
            <AppText variant="heading">
              {formatPaisa(state.payment.amountPaisa, locale)}
            </AppText>
            <AppText>
              {t('paymentReceiptBalance', {
                amount: formatPaisa(state.payment.remainingPaisa, locale),
              })}
            </AppText>
            <AppText variant="label">{t('paymentDate')}</AppText>
            <AppText>{billDate(state.payment.receivedOn, locale)}</AppText>
            <AppText>{t(methodLabel(state.payment.method))}</AppText>
            {state.payment.reference ? (
              <>
                <AppText variant="label">{t('paymentTransaction')}</AppText>
                <AppText>{state.payment.reference}</AppText>
              </>
            ) : undefined}
            {state.payment.notes ? (
              <>
                <AppText variant="label">{t('paymentNotes')}</AppText>
                <AppText>{state.payment.notes}</AppText>
              </>
            ) : undefined}
            <AppText variant="heading">{t('paymentAllocate')}</AppText>
            {state.allocations.map((entry) => (
              <AppText key={entry.lineId}>
                {billMonth(entry.month, locale)} ·{' '}
                {entry.kind === 'other'
                  ? entry.name
                  : t(chargeLabel(entry.kind))}{' '}
                · {formatPaisa(entry.amountPaisa, locale)}
              </AppText>
            ))}
            <AppText color={colors.muted}>
              {t('paymentRecordedTime', {
                time: time(state.payment.recordedAt),
              })}
            </AppText>
            {state.payment.status === 'reversed' ? (
              <>
                <AppText variant="label">{t('paymentReverseReason')}</AppText>
                <AppText>{state.payment.reversalReason}</AppText>
                {state.payment.reversedAt && (
                  <AppText>
                    {t('paymentReversalTime', {
                      time: time(state.payment.reversedAt),
                    })}
                  </AppText>
                )}
              </>
            ) : (
              <PrimaryButton
                label={t('paymentReverse')}
                onPress={() => setReversing(true)}
              />
            )}
            <AppText variant="label" color={colors.muted}>
              {t('paymentLocalHint')}
            </AppText>
          </>
        ) : state.status === 'loading' ? (
          <ActivityIndicator color={colors.brand} />
        ) : (
          <>
            <AppText accessibilityRole="alert">
              {t(
                state.status === 'missing'
                  ? 'paymentMissing'
                  : 'paymentReadError',
              )}
            </AppText>
            <PrimaryButton
              label={t('retry')}
              onPress={() => {
                setState({ status: 'loading' });
                setAttempt((n) => n + 1);
              }}
            />
          </>
        )}
      </PaymentFormFrame>
      {state.status === 'ready' && reversing && (
        <PaymentReversalForm
          payment={state.payment}
          onClose={() => setReversing(false)}
          onSaved={() => {
            setReversing(false);
            setAttempt((n) => n + 1);
            onChanged();
          }}
        />
      )}
    </>
  );
}
