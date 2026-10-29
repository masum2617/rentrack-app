import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  TextInput,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../../i18n/LocaleProvider';
import type { MessageKey } from '../../i18n/messages';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { fontFamilies } from '../../theme/typography';
import { TenantRow } from './TenantRow';
import { filterTenants, type Tenant } from './tenantStore';

import { readTenantDirectory, type TenantSummary } from './tenantReadModel';

type ListState =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; tenants: TenantSummary[] };

export function TenantsScreen({
  revision,
  onAdd,
  onEdit,
  notice,
}: {
  revision: number;
  onAdd: () => void;
  onEdit: (tenant: Tenant) => void;
  notice?: MessageKey;
}) {
  const { locale, t } = useLocale();
  const { width, fontScale } = useWindowDimensions();
  const [state, setState] = useState<ListState>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [search, setSearch] = useState('');
  const stacked = width < 360 || fontScale > 1.3;
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const tenants = await readTenantDirectory(await getDatabase());
        if (active) setState({ status: 'ready', tenants });
      } catch {
        if (active) setState({ status: 'error' });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [revision, attempt]);

  function retry() {
    setState({ status: 'loading' });
    setAttempt((value) => value + 1);
  }

  const visible =
    state.status === 'ready' ? filterTenants(state.tenants, search) : [];
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={[styles.header, stacked && styles.stacked]}>
        <View style={!stacked && styles.identity}>
          <AppText accessibilityRole="header" variant="title">
            {t('tenants')}
          </AppText>
          <AppText variant="label" color={colors.muted}>
            {t('tenantListSubtitle')}
          </AppText>
        </View>
        <View style={!stacked && styles.add}>
          <PrimaryButton label={t('newTenant')} onPress={onAdd} />
        </View>
      </View>
      <View style={styles.body}>
        <View style={styles.search}>
          <AssetIcon name="search" />
          <TextInput
            accessibilityLabel={t('searchTenants')}
            placeholder={t('searchTenants')}
            placeholderTextColor={colors.muted}
            value={search}
            onChangeText={setSearch}
            autoCorrect={false}
            returnKeyType="search"
            style={[
              styles.searchInput,
              {
                fontFamily:
                  fontFamilies[/[\u0980-\u09ff]/.test(search) ? 'bn' : locale]
                    .regular,
              },
            ]}
          />
        </View>
        {search.length > 0 && (
          <Pressable
            accessibilityRole="button"
            onPress={() => setSearch('')}
            style={styles.clear}
          >
            <AppText variant="label" color={colors.brand}>
              {t('clearSearch')}
            </AppText>
          </Pressable>
        )}
        {notice && (
          <AppText
            variant="label"
            color={colors.brand}
            accessibilityLiveRegion="polite"
          >
            {t(notice)}
          </AppText>
        )}
        <FlatList
          data={visible}
          keyExtractor={(tenant) => String(tenant.id)}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.list}
          renderItem={({ item }) => <TenantRow tenant={item} onEdit={onEdit} />}
          ListEmptyComponent={
            <View style={styles.state}>
              {state.status === 'loading' ? (
                <>
                  <ActivityIndicator
                    color={colors.brand}
                    accessibilityLabel={t('tenantsLoading')}
                  />
                  <AppText>{t('tenantsLoading')}</AppText>
                </>
              ) : state.status === 'error' ? (
                <>
                  <AppText variant="heading" accessibilityRole="alert">
                    {t('tenantsLoadError')}
                  </AppText>
                  <AppText color={colors.muted}>
                    {t('tenantsLoadErrorBody')}
                  </AppText>
                  <PrimaryButton label={t('retry')} onPress={retry} />
                </>
              ) : state.tenants.length === 0 ? (
                <>
                  <AppText variant="heading">{t('noTenants')}</AppText>
                  <AppText color={colors.muted}>{t('noTenantsBody')}</AppText>
                  <PrimaryButton label={t('newTenant')} onPress={onAdd} />
                </>
              ) : (
                <>
                  <AppText variant="heading">{t('noTenantMatches')}</AppText>
                  <AppText color={colors.muted}>
                    {t('noTenantMatchesBody')}
                  </AppText>
                </>
              )}
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 20,
    paddingTop: 12,
  },
  identity: { flex: 1 },
  stacked: { flexDirection: 'column', alignItems: 'stretch' },
  add: { width: 180 },
  body: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    paddingBottom: 0,
    gap: 16,
  },
  search: {
    minHeight: 60,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colors.inputBoundary,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    minHeight: 58,
    fontSize: 16,
    color: colors.ink,
    paddingVertical: 12,
  },
  clear: { minHeight: 48, justifyContent: 'center', alignSelf: 'flex-start' },
  list: { gap: 16, padding: 4, paddingBottom: 44 },
  state: { gap: 16, paddingVertical: 24 },
});
