import { StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { dateForPicker } from '../tenancies/tenancyValidation';
import { BillChoice } from './BillChoice';

export function BillMonthPicker({
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  value: string;
  min: string;
  max: string;
  onChange: (value: string) => void;
  disabled: boolean;
}) {
  const { locale, t } = useLocale();
  const year = value.slice(0, 4);
  const years = Array.from(
    { length: Number(max.slice(0, 4)) - Number(min.slice(0, 4)) + 1 },
    (_, i) => String(Number(max.slice(0, 4)) - i).padStart(4, '0'),
  );
  const months = Array.from(
    { length: 12 },
    (_, i) => `${year}-${String(i + 1).padStart(2, '0')}`,
  ).filter((month) => month >= min && month <= max);
  return (
    <View style={styles.fields}>
      <BillChoice
        label={t('billYear')}
        value={year}
        disabled={disabled}
        options={years.map((item) => ({
          value: item,
          label: new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
            year: 'numeric',
            calendar: 'gregory',
          }).format(dateForPicker(`${item}-01-01`)),
        }))}
        onChange={(chosen) => {
          const candidate = `${chosen}-${value.slice(5)}`;
          onChange(candidate < min ? min : candidate > max ? max : candidate);
        }}
      />
      <BillChoice
        label={t('billMonthName')}
        value={value}
        disabled={disabled}
        options={months.map((month) => ({
          value: month,
          label: new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
            month: 'long',
            calendar: 'gregory',
          }).format(dateForPicker(`${month}-01`)),
        }))}
        onChange={onChange}
      />
    </View>
  );
}
const styles = StyleSheet.create({ fields: { gap: 16 } });
