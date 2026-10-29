import { StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';

export function RentalLocation({
  propertyName,
  floorName,
  unitName,
}: {
  propertyName: string;
  floorName: string;
  unitName: string;
}) {
  const { t } = useLocale();
  return (
    <View style={styles.location}>
      <AppText
        style={
          /[\u0980-\u09ff]/.test(propertyName)
            ? { fontFamily: fontFamilies.bn.medium }
            : undefined
        }
      >
        {propertyName}
      </AppText>
      <View style={styles.row}>
        <AppText
          variant="label"
          color={colors.muted}
          style={[
            styles.item,
            /[\u0980-\u09ff]/.test(floorName) && {
              fontFamily: fontFamilies.bn.medium,
            },
          ]}
        >
          {t('rentalFloorLabel', { name: floorName })}
        </AppText>
        <AppText
          variant="label"
          color={colors.muted}
          style={[
            styles.item,
            /[\u0980-\u09ff]/.test(unitName) && {
              fontFamily: fontFamilies.bn.medium,
            },
          ]}
        >
          {t('rentalUnitLabel', { name: unitName })}
        </AppText>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  location: { gap: 4 },
  row: { flexDirection: 'row', flexWrap: 'wrap', columnGap: 16, rowGap: 4 },
  item: { maxWidth: '100%', flexShrink: 1 },
});
