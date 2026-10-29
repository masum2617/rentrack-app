import { View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { formatPaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { chargeLabel } from '../tenancies/chargePresentation';
import type { Bill } from './billStore';

export function BillItems({ bill }: { bill: Bill }) {
  const { t, locale } = useLocale();
  return (
    <View style={{ gap: 20 }}>
      {bill.lines.map((line) => (
        <View key={line.id} style={{ gap: 8 }}>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: 12,
            }}
          >
            <AppText>
              {line.kind === 'other' ? line.name : t(chargeLabel(line.kind))}
            </AppText>
            <AppText>{formatPaisa(line.amountPaisa, locale)}</AppText>
          </View>
          {line.sourceMode === 'fixed' && (
            <AppText variant="label" color={colors.muted}>
              {t('chargeProposed', {
                amount: formatPaisa(line.proposedPaisa, locale),
              })}
            </AppText>
          )}
          {bill.status === 'finalized' && (
            <AppText variant="label" color={colors.muted}>
              {t('paymentApplied', {
                amount: formatPaisa(line.paidPaisa ?? 0, locale),
              })}
            </AppText>
          )}
          {line.sourceMode === 'manual' && (
            <AppText variant="label" color={colors.muted}>
              {t('chargeManual')}
            </AppText>
          )}
          {line.kind !== 'rent' && line.overrideReason ? (
            <>
              <AppText variant="label" color={colors.muted}>
                {t('billReason')}
              </AppText>
              <AppText>{line.overrideReason}</AppText>
            </>
          ) : undefined}
        </View>
      ))}
      <AppText variant="label">{t('chargeTotal')}</AppText>
      <AppText variant="heading">
        {formatPaisa(bill.amountPaisa, locale)}
      </AppText>
      {bill.status === 'finalized' && (
        <AppText>
          {t('paymentApplied', { amount: formatPaisa(bill.paidPaisa, locale) })}
        </AppText>
      )}
    </View>
  );
}
