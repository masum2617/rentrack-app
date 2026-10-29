import { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, Pressable, View } from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import { useLocale } from '../../i18n/LocaleProvider';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { formatPaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { RentalLocation } from '../tenancies/RentalLocation';
import { billDate } from './billPresentation';
import { getBill, getBillingTenancy, type BillingTenancy } from './billStore';
import { listPayments, type Payment } from './paymentStore';
import { PaymentFormFrame } from './PaymentFormFrame';

type State =
  | { status: 'loading' | 'error' | 'missing' }
  | { status: 'ready'; tenancy: BillingTenancy; payments: Payment[] };
export function PaymentHistoryScreen({
  tenancyId,
  billId,
  revision,
  onBack,
  onReceipt,
}: {
  tenancyId: number;
  billId?: number;
  revision: number;
  onBack: () => void;
  onReceipt: (id: number) => void;
}) {
  const { t, locale, number } = useLocale(),
    focused = useIsFocused();
  const [state, setState] = useState<State>({ status: 'loading' }),
    [attempt, setAttempt] = useState(0);
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
        const [tenancy, payments, bill] = await Promise.all([
          getBillingTenancy(db, tenancyId),
          listPayments(db, { tenancyId, billId }),
          billId === undefined ? undefined : getBill(db, billId),
        ]);
        if (active)
          setState(
            tenancy && (billId === undefined || bill?.tenancyId === tenancyId)
              ? { status: 'ready', tenancy, payments }
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
  }, [tenancyId, billId, revision, focused, attempt]);
  return (
    <PaymentFormFrame title={t('paymentHistory')} busy={false} onBack={onBack}>
      {state.status === 'ready' ? (
        <>
          <RentalLocation
            propertyName={state.tenancy.propertyName}
            floorName={state.tenancy.floorName}
            unitName={state.tenancy.unitName}
          />
          <AppText>{state.tenancy.tenantName}</AppText>
          {!state.payments.length && <AppText>{t('paymentNoHistory')}</AppText>}
          {state.payments.map((payment) => (
            <Pressable
              key={payment.id}
              accessibilityRole="button"
              onPress={() => onReceipt(payment.id)}
              style={[surfaces.card, { padding: 20, minHeight: 52, gap: 12 }]}
            >
              <AppText>
                {t('paymentReference', { id: number(payment.id) })}
              </AppText>
              <AppText variant="heading">
                {formatPaisa(payment.amountPaisa, locale)}
              </AppText>
              <View style={{ gap: 8 }}>
                <AppText>{billDate(payment.receivedOn, locale)}</AppText>
                <AppText
                  color={
                    payment.status === 'reversed' ? colors.error : colors.brand
                  }
                >
                  {t(
                    payment.status === 'reversed'
                      ? 'paymentReversed'
                      : 'paymentRecorded',
                  )}
                </AppText>
              </View>
            </Pressable>
          ))}
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
  );
}
