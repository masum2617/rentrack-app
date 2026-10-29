import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type ScrollViewInstance,
} from 'react-native';
import { useIsFocused, useScrollToTop } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../../i18n/LocaleProvider';
import { LanguageSelector } from '../../i18n/LanguageSelector';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { ChoiceSheet } from '../../shared/ui/ChoiceSheet';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { localDate } from '../tenancies/tenancyValidation';
import { billMonth } from '../ledger/billPresentation';
import type { BillScope } from '../ledger/billFilters';
import { AttentionList } from './AttentionList';
import { EmptyHome } from './EmptyHome';
import { FinancialSummary } from './FinancialSummary';
import { HomePaymentFlow } from './HomePaymentFlow';
import {
  readHomeData,
  homeSummary,
  homeMonths,
  type HomeData,
  type PayableTenancy,
} from './homeData';

type State =
  | { status: 'loading' }
  | { status: 'error' }
  | { status: 'ready'; data: HomeData };
function homeView(state: State, propertyId: number | undefined, month: string) {
  if (state.status !== 'ready') return state;
  if (
    propertyId !== undefined &&
    !state.data.properties.some((property) => property.id === propertyId)
  )
    return { status: 'missingProperty' } as const;
  try {
    return {
      status: 'ready',
      data: state.data,
      summary: homeSummary(state.data, propertyId, month),
    } as const;
  } catch {
    return { status: 'error' } as const;
  }
}
export function HomeScreen({
  revision,
  onAddProperty,
  onOpenProperties,
  onOpenBills,
  onChanged,
}: {
  revision: number;
  onAddProperty: () => void;
  onOpenProperties: () => void;
  onOpenBills: (scope: BillScope) => void;
  onChanged: () => void;
}) {
  const { t, number, locale } = useLocale(),
    focused = useIsFocused();
  const { width, fontScale } = useWindowDimensions();
  const compact = width >= 380 && fontScale <= 1.15;
  const [propertyId, setPropertyId] = useState('all');
  const [month, setMonth] = useState(() => localDate().slice(0, 7));
  const [picker, setPicker] = useState<'property' | 'month'>();
  const [state, setState] = useState<State>({ status: 'loading' }),
    [attempt, setAttempt] = useState(0);
  const [paymentCandidates, setPaymentCandidates] =
    useState<PayableTenancy[]>();
  const scroll = useRef<ScrollViewInstance>(null);
  useScrollToTop(scroll);
  useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      if (status === 'active') setAttempt((n) => n + 1);
    });
    return () => listener.remove();
  }, []);
  useEffect(() => {
    if (!focused) return;
    let active = true;
    setState({ status: 'loading' });
    async function load() {
      try {
        const data = await readHomeData(await getDatabase());
        if (active) setState({ status: 'ready', data });
      } catch {
        if (active) setState({ status: 'error' });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [revision, attempt, focused]);
  const selectedProperty =
    propertyId === 'all' ? undefined : Number(propertyId);
  const view = homeView(state, selectedProperty, month);
  const propertyName =
    state.status === 'ready'
      ? (state.data.properties.find(
          (property) => property.id === selectedProperty,
        )?.name ?? t('allProperties'))
      : t('properties');
  const monthName = billMonth(month, locale);
  const empty = view.status === 'ready' && view.data.properties.length === 0;
  function openBills(scope: BillScope) {
    onOpenBills({ ...scope, propertyId: selectedProperty });
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={[styles.header, !compact && styles.headerStacked]}>
        <View style={[styles.identity, !compact && styles.stackedItem]}>
          <AppText accessibilityRole="header" variant="title">
            {t(empty ? 'getStarted' : 'overview')}
          </AppText>
          <AppText variant="meta" color={colors.muted}>
            {view.status === 'ready' && !empty
              ? t(
                  view.summary.properties === 1 ? 'portfolioOne' : 'portfolio',
                  {
                    properties: number(view.summary.properties),
                    units: number(view.summary.units),
                  },
                )
              : t('yourAccount')}
          </AppText>
        </View>
        <LanguageSelector compact={compact} />
      </View>
      <ScrollView
        ref={scroll}
        style={styles.body}
        contentContainerStyle={styles.content}
      >
        {view.status === 'ready' ? (
          empty ? (
            <EmptyHome onAdd={onAddProperty} />
          ) : (
            <>
              <View
                style={[styles.selectors, !compact && styles.selectorStacked]}
              >
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${t('properties')}: ${propertyName}`}
                  onPress={() => setPicker('property')}
                  style={[
                    surfaces.control,
                    styles.selector,
                    !compact && styles.stackedItem,
                  ]}
                >
                  <AppText variant="label" style={styles.selectorLabel}>
                    {propertyName}
                  </AppText>
                  <AssetIcon name="down" />
                </Pressable>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`${t('billingMonth')}: ${monthName}`}
                  onPress={() => setPicker('month')}
                  style={[
                    surfaces.control,
                    styles.selector,
                    !compact && styles.stackedItem,
                  ]}
                >
                  <AppText variant="label" style={styles.selectorLabel}>
                    {monthName}
                  </AppText>
                  <AssetIcon name="down" />
                </Pressable>
              </View>
              <FinancialSummary
                outstanding={view.summary.outstanding}
                billed={view.summary.billed}
                received={view.summary.received}
                month={monthName}
              />
              <AppText variant="meta" color={colors.muted}>
                {t('homeScopeHint')}
              </AppText>
              <PrimaryButton
                label={t('paymentRecord')}
                disabled={!view.summary.payables.length}
                onPress={() => setPaymentCandidates(view.summary.payables)}
              />
              {!view.summary.payables.length && (
                <AppText color={colors.muted}>{t('homeNoPayable')}</AppText>
              )}
              <Pressable
                accessibilityRole="button"
                onPress={() => openBills({ status: 'outstanding' })}
                style={[
                  surfaces.control,
                  { minHeight: 52, padding: 12, alignItems: 'center' },
                ]}
              >
                <AppText color={colors.brand}>{t('homeViewDues')}</AppText>
              </Pressable>
              {!view.summary.monthBillCount && (
                <>
                  <AppText>{t('homeNoBills')}</AppText>
                  <PrimaryButton
                    label={t('homeViewProperties')}
                    onPress={onOpenProperties}
                  />
                </>
              )}
              {view.summary.monthBillCount > 0 &&
                view.summary.billed === 0 &&
                view.summary.received === 0 && (
                  <AppText>{t('homeNoActivity')}</AppText>
                )}
              <View style={styles.occupancy}>
                <AppText variant="label" style={styles.occupancyText}>
                  {t('occupied', { count: number(view.summary.occupied) })}
                </AppText>
                <AppText
                  variant="label"
                  color={colors.muted}
                  style={styles.occupancyText}
                >
                  {t('vacant', {
                    count: number(view.summary.units - view.summary.occupied),
                  })}
                </AppText>
              </View>
              <AttentionList
                overdue={view.summary.overdue}
                drafts={view.summary.drafts}
                onOverdue={() => openBills({ status: 'overdue' })}
                onDrafts={() => openBills({ month, status: 'draft' })}
              />
              <AppText variant="meta" color={colors.muted}>
                {t('homeSavedPhone')}
              </AppText>
            </>
          )
        ) : view.status === 'loading' ? (
          <>
            <ActivityIndicator color={colors.brand} />
            <AppText>{t('homeLoading')}</AppText>
          </>
        ) : (
          <>
            <AppText accessibilityRole="alert" color={colors.error}>
              {t(
                view.status === 'missingProperty'
                  ? 'homeMissingProperty'
                  : 'homeLoadError',
              )}
            </AppText>
            <PrimaryButton
              label={t('retry')}
              onPress={() => setAttempt((n) => n + 1)}
            />
            <PrimaryButton
              label={t('homeShowAll')}
              onPress={() => {
                setPropertyId('all');
                setMonth(localDate().slice(0, 7));
              }}
            />
          </>
        )}
      </ScrollView>
      {state.status === 'ready' && (
        <>
          <ChoiceSheet
            visible={picker === 'property'}
            title={t('properties')}
            selected={propertyId}
            onSelect={setPropertyId}
            onClose={() => setPicker(undefined)}
            choices={[
              { value: 'all', label: t('allProperties') },
              ...state.data.properties.map((property) => ({
                value: String(property.id),
                label: property.name,
              })),
            ]}
          />
          <ChoiceSheet
            visible={picker === 'month'}
            title={t('billingMonth')}
            selected={month}
            onSelect={setMonth}
            onClose={() => setPicker(undefined)}
            choices={homeMonths(state.data).map((value) => ({
              value,
              label: billMonth(value, locale),
            }))}
          />
        </>
      )}
      {paymentCandidates && (
        <HomePaymentFlow
          candidates={paymentCandidates}
          revision={revision}
          onClose={() => setPaymentCandidates(undefined)}
          onChanged={onChanged}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  identity: { flex: 1 },
  stackedItem: { flex: 0 },
  body: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: { padding: 20, paddingTop: 16, paddingBottom: 44, gap: 16 },
  selectors: { flexDirection: 'row', gap: 12 },
  selectorStacked: { flexDirection: 'column' },
  selector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    padding: 12,
  },
  selectorLabel: { flex: 1 },
  occupancy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 36,
    gap: 12,
  },
  occupancyText: { flexShrink: 1 },
});
