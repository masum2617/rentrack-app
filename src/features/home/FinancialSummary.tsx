import { StyleSheet, View, useWindowDimensions } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { formatPaisa } from '../../shared/money/paisa';

export function FinancialSummary({
  outstanding,
  billed,
  received,
  month,
}: {
  outstanding: number;
  billed: number;
  received: number;
  month: string;
}) {
  const { t, locale } = useLocale();
  const { width, fontScale } = useWindowDimensions();
  const stacked = width < 370 || fontScale > 1.15;
  return (
    <View style={[surfaces.card, styles.card]}>
      <View style={[styles.scope, stacked && styles.stacked]}>
        <AppText
          variant="label"
          color={colors.muted}
          style={[styles.scopeLabel, stacked && styles.stackedItem]}
        >
          {t('homeOutstanding')}
        </AppText>
      </View>
      <AppText variant="amount">{formatPaisa(outstanding, locale)}</AppText>
      <View style={styles.divider} />
      <View style={[styles.metrics, stacked && styles.stacked]}>
        <View style={[styles.metric, stacked && styles.stackedItem]}>
          <AppText variant="label" color={colors.muted}>
            {t('homeBilled', { month })}
          </AppText>
          <AppText variant="metric">{formatPaisa(billed, locale)}</AppText>
        </View>
        <View style={[styles.metric, stacked && styles.stackedItem]}>
          <AppText variant="label" color={colors.muted}>
            {t('homeReceived', { month })}
          </AppText>
          <AppText variant="metric">{formatPaisa(received, locale)}</AppText>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { gap: 4 },
  scope: { flexDirection: 'row', alignItems: 'flex-start', gap: 8 },
  scopeLabel: { flex: 1 },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 8 },
  metrics: { flexDirection: 'row', gap: 12 },
  metric: { flex: 1, minWidth: 0 },
  stackedItem: { flex: 0 },
  stacked: { flexDirection: 'column' },
});
