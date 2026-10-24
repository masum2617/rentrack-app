import { StyleSheet, View, useWindowDimensions } from "react-native";
import { useLocale } from "../../i18n/LocaleProvider";
import { AppText } from "../../shared/ui/AppText";
import { colors } from "../../theme/colors";
import { surfaces } from "../../theme/surfaces";

export function FinancialSummary({
  outstanding,
  billed,
  received,
}: {
  outstanding: number;
  billed: number;
  received: number;
}) {
  const { t, money } = useLocale();
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
          {t("outstanding")}
        </AppText>
        <View style={styles.badge}>
          <AppText variant="meta" color={colors.brand}>
            {t("demo")}
          </AppText>
        </View>
      </View>
      <AppText variant="amount">{money(outstanding)}</AppText>
      <View style={styles.divider} />
      <View style={[styles.metrics, stacked && styles.stacked]}>
        <View style={[styles.metric, stacked && styles.stackedItem]}>
          <AppText variant="label" color={colors.muted}>
            {t("billed")}
          </AppText>
          <AppText variant="metric">{money(billed)}</AppText>
        </View>
        <View style={[styles.metric, stacked && styles.stackedItem]}>
          <AppText variant="label" color={colors.muted}>
            {t("received")}
          </AppText>
          <AppText variant="metric">{money(received)}</AppText>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { gap: 4 },
  scope: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  scopeLabel: { flex: 1 },
  badge: {
    backgroundColor: colors.selected,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 1,
  },
  divider: { height: 1, backgroundColor: colors.line, marginVertical: 8 },
  metrics: { flexDirection: "row", gap: 12 },
  metric: { flex: 1, minWidth: 0 },
  stackedItem: { flex: 0 },
  stacked: { flexDirection: "column" },
});
