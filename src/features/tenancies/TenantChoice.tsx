import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { FormField } from '../../shared/ui/FormField';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import {
  listTenants,
  filterTenants,
  type Tenant,
} from '../tenants/tenantStore';

export function TenantChoice({
  selectedId,
  onSelect,
}: {
  selectedId?: number;
  onSelect: (tenant: Tenant) => void;
}) {
  const { t } = useLocale();
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'error' }
    | { status: 'ready'; tenants: Tenant[] }
  >({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState('');
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const tenants = await listTenants(await getDatabase());
        if (active) setState({ status: 'ready', tenants });
      } catch {
        if (active) setState({ status: 'error' });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [attempt]);
  const visible =
    state.status === 'ready' ? filterTenants(state.tenants, search) : [];
  return (
    <View style={styles.screen}>
      <FormField
        label={t('tenancyChooseTenant')}
        value={search}
        placeholder={t('searchTenants')}
        editable
        onChangeText={setSearch}
        returnKeyType="done"
      />
      <FlatList
        data={visible}
        keyExtractor={(tenant) => String(tenant.id)}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="radio"
            accessibilityState={{ checked: selectedId === item.id }}
            onPress={() => onSelect(item)}
            style={[styles.row, selectedId === item.id && styles.selected]}
          >
            <AppText
              variant="heading"
              style={
                /[\u0980-\u09ff]/.test(item.name)
                  ? { fontFamily: fontFamilies.bn.semibold }
                  : undefined
              }
            >
              {item.name}
            </AppText>
            <AppText color={colors.muted}>
              {item.phone || t('tenantPhoneMissing')}
            </AppText>
            {item.address ? (
              <AppText
                variant="label"
                color={colors.muted}
                style={
                  /[\u0980-\u09ff]/.test(item.address)
                    ? { fontFamily: fontFamilies.bn.medium }
                    : undefined
                }
              >
                {item.address}
              </AppText>
            ) : undefined}
            {selectedId === item.id && (
              <AppText color={colors.brand}>{t('tenancySelected')}</AppText>
            )}
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            {state.status === 'loading' ? (
              <>
                <ActivityIndicator color={colors.brand} />
                <AppText>{t('tenantsLoading')}</AppText>
              </>
            ) : state.status === 'error' ? (
              <>
                <AppText accessibilityRole="alert">
                  {t('tenantsLoadError')}
                </AppText>
                <PrimaryButton
                  label={t('retry')}
                  onPress={() => {
                    setState({ status: 'loading' });
                    setAttempt((n) => n + 1);
                  }}
                />
              </>
            ) : (
              <AppText>
                {t(
                  state.tenants.length
                    ? 'noTenantMatchesBody'
                    : 'tenancyAddTenantFirst',
                )}
              </AppText>
            )}
          </View>
        }
      />
    </View>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, gap: 16 },
  list: { gap: 12, paddingBottom: 24 },
  row: {
    borderWidth: 1,
    borderColor: colors.inputBoundary,
    borderRadius: 12,
    padding: 16,
    gap: 8,
    minHeight: 64,
  },
  selected: {
    borderColor: colors.brand,
    backgroundColor: colors.selected,
    borderWidth: 2,
  },
  empty: { gap: 16, paddingVertical: 20 },
});
