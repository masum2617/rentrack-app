import { StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { formatPaisa } from '../../shared/money/paisa';
import type { Tenancy } from './tenancyStore';
import { dateForPicker } from './tenancyValidation';

export type RentalTerms = Pick<
  Tenancy,
  'startDate' | 'rentPaisa' | 'dueDay' | 'noticeMonths' | 'agreedAdvancePaisa'
>;
export function TenancyTerms({ terms }: { terms: RentalTerms }) {
  const { locale, number, t } = useLocale();
  return (
    <View style={styles.section}>
      <View>
        <AppText variant="label" color={colors.muted}>
          {t('tenancyStartDate')}
        </AppText>
        <AppText>
          {new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
            calendar: 'gregory',
          }).format(dateForPicker(terms.startDate))}
        </AppText>
      </View>
      <View>
        <AppText variant="label" color={colors.muted}>
          {t('tenancyRent')}
        </AppText>
        <AppText>{formatPaisa(terms.rentPaisa, locale)}</AppText>
      </View>
      <View>
        <AppText variant="label" color={colors.muted}>
          {t('tenancyDueDay')}
        </AppText>
        <AppText>{number(terms.dueDay)}</AppText>
        <AppText variant="label" color={colors.muted}>
          {t('tenancyDueHint')}
        </AppText>
      </View>
      <View>
        <AppText variant="label" color={colors.muted}>
          {t('tenancyNotice')}
        </AppText>
        <AppText>
          {t('tenancyMonthCount', { count: number(terms.noticeMonths) })}
        </AppText>
      </View>
      <View>
        <AppText variant="label" color={colors.muted}>
          {t('tenancyAgreedAdvance')}
        </AppText>
        <AppText>{formatPaisa(terms.agreedAdvancePaisa, locale)}</AppText>
        <AppText variant="label" color={colors.muted}>
          {t('tenancyAdvanceHint')}
        </AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({ section: { gap: 20 } });
