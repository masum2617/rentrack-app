import { RentalLocation } from '../tenancies/RentalLocation';
import { EditButton } from '../../shared/ui/EditButton';
import { StyleSheet, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { fontFamilies } from '../../theme/typography';
import type { TenantSummary } from './tenantReadModel';
import type { Tenant } from './tenantStore';

export function TenantRow({
  tenant,
  onEdit,
}: {
  tenant: TenantSummary;
  onEdit: (tenant: Tenant) => void;
}) {
  const { t } = useLocale();
  return (
    <View style={[surfaces.card, styles.card]}>
      <View style={styles.heading}>
        <AppText
          variant="heading"
          style={[
            styles.name,
            /[\u0980-\u09ff]/.test(tenant.name) && {
              fontFamily: fontFamilies.bn.semibold,
            },
          ]}
        >
          {tenant.name}
        </AppText>
        <EditButton
          label={t('editNamedTenant', { name: tenant.name })}
          onPress={() => onEdit(tenant)}
        />
      </View>
      <AppText color={colors.muted}>
        {tenant.phone || t('tenantPhoneMissing')}
      </AppText>
      {tenant.address ? (
        <AppText
          variant="label"
          color={colors.muted}
          style={
            /[\u0980-\u09ff]/.test(tenant.address)
              ? { fontFamily: fontFamilies.bn.medium }
              : undefined
          }
        >
          {tenant.address}
        </AppText>
      ) : undefined}
      <View style={styles.rentals}>
        {tenant.rentals.length ? (
          tenant.rentals.map((rental) => (
            <RentalLocation
              key={rental.tenancyId}
              propertyName={rental.propertyName}
              floorName={rental.floorName}
              unitName={rental.unitName}
            />
          ))
        ) : (
          <AppText variant="label" color={colors.muted}>
            {t('noActiveTenancy')}
          </AppText>
        )}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  rentals: { gap: 8 },
  card: { padding: 20, gap: 12 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  name: { flex: 1 },
});
