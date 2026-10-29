import { StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { formatPaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import type { BillProposal } from './billCalculations';
import { billDate } from './billPresentation';

export function BillFigures({
  proposal,
  amountPaisa,
  reason,
}: {
  proposal: BillProposal;
  amountPaisa?: number;
  reason?: string;
}) {
  const { locale, t, number } = useLocale();
  const days =
    Number(proposal.coveredThrough.slice(8)) -
    Number(proposal.coveredFrom.slice(8)) +
    1;
  return (
    <View style={styles.fields}>
      <View>
        <AppText variant="label" color={colors.muted}>
          {t('billCoverage')}
        </AppText>
        <AppText>
          {billDate(proposal.coveredFrom, locale)} –{' '}
          {billDate(proposal.coveredThrough, locale)}
        </AppText>
      </View>
      <View>
        <AppText variant="label" color={colors.muted}>
          {t('billDue')}
        </AppText>
        <AppText>{billDate(proposal.dueDate, locale)}</AppText>
      </View>
      <View>
        <AppText variant="label" color={colors.muted}>
          {t('billReferenceRent')}
        </AppText>
        <AppText>{formatPaisa(proposal.referenceRentPaisa, locale)}</AppText>
      </View>
      <View>
        <AppText variant="label" color={colors.muted}>
          {t('billProposal')}
        </AppText>
        <AppText>{formatPaisa(proposal.proposedPaisa, locale)}</AppText>
        <AppText variant="label" color={colors.muted}>
          {t(
            proposal.coveredFrom.endsWith('-01')
              ? 'billFullCalculation'
              : 'billPartialCalculation',
            {
              days: number(days),
              total: number(Number(proposal.coveredThrough.slice(8))),
            },
          )}
        </AppText>
      </View>
      {amountPaisa !== undefined && (
        <View>
          <AppText variant="label" color={colors.muted}>
            {t('billReviewedAmount')}
          </AppText>
          <AppText variant="heading">
            {formatPaisa(amountPaisa, locale)}
          </AppText>
        </View>
      )}
      {reason ? (
        <View>
          <AppText variant="label" color={colors.muted}>
            {t('billReason')}
          </AppText>
          <AppText>{reason}</AppText>
        </View>
      ) : undefined}
    </View>
  );
}
const styles = StyleSheet.create({ fields: { gap: 20 } });
