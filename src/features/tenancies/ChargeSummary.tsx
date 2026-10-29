import { View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { formatPaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { chargeKinds, type ChargeSettings } from './chargeSettings';
import { chargeLabel } from './chargePresentation';

export function ChargeSummary({ settings }: { settings?: ChargeSettings }) {
  const { t, locale } = useLocale();
  const enabled = chargeKinds.filter(
    (kind) => settings && settings[kind].mode !== 'none',
  );
  if (!enabled.length)
    return <AppText color={colors.muted}>{t('chargeNoneConfigured')}</AppText>;
  return (
    <View style={{ gap: 12 }}>
      {enabled.map((kind) => (
        <AppText key={kind}>
          {t(
            settings?.[kind].mode === 'manual'
              ? 'chargeManualValue'
              : 'chargeFixedValue',
            {
              name: t(chargeLabel(kind)),
              amount: formatPaisa(settings?.[kind].amountPaisa ?? 0, locale),
            },
          )}
        </AppText>
      ))}
    </View>
  );
}
