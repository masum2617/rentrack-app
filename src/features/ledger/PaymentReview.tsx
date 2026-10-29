import { View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { formatPaisa } from '../../shared/money/paisa';
import { chargeLabel } from '../tenancies/chargePresentation';
import { billDate, billMonth } from './billPresentation';
import { methodLabel } from './paymentPresentation';
import { safeTotal } from './billCalculations';
import type { PaymentInput, Allocation, DueLine } from './paymentValidation';

export function PaymentReview({
  input,
  amount,
  allocations,
  due,
}: {
  input: PaymentInput;
  amount: number;
  allocations: Allocation[];
  due: DueLine[];
}) {
  const { t, locale } = useLocale();
  return (
    <View style={{ gap: 16 }}>
      <AppText variant="heading">{formatPaisa(amount, locale)}</AppText>
      <AppText>{billDate(input.receivedOn, locale)}</AppText>
      {input.method && <AppText>{t(methodLabel(input.method))}</AppText>}
      {input.reference ? (
        <AppText>
          {t('paymentTransaction')}: {input.reference}
        </AppText>
      ) : undefined}
      {input.notes ? (
        <AppText>
          {t('paymentNotes')}: {input.notes}
        </AppText>
      ) : undefined}
      {allocations.map((allocation) => {
        const line = due.find((entry) => entry.lineId === allocation.lineId);
        if (!line) return undefined;
        return (
          <View key={line.lineId} style={{ gap: 8 }}>
            <AppText>
              {billMonth(line.month, locale)} ·{' '}
              {line.kind === 'other' ? line.name : t(chargeLabel(line.kind))}
            </AppText>
            <AppText>{formatPaisa(allocation.amountPaisa, locale)}</AppText>
            <AppText>
              {t('paymentBalanceAfter', {
                amount: formatPaisa(
                  line.outstandingPaisa - allocation.amountPaisa,
                  locale,
                ),
              })}
            </AppText>
          </View>
        );
      })}
      <AppText variant="heading">
        {t('paymentTenancyBalanceAfter', {
          amount: formatPaisa(
            safeTotal(due.map((line) => line.outstandingPaisa)) - amount,
            locale,
          ),
        })}
      </AppText>
    </View>
  );
}
