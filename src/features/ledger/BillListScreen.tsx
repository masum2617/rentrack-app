import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  AppState,
  FlatList,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useIsFocused } from '@react-navigation/native';
import { useLocale } from '../../i18n/LocaleProvider';
import type { MessageKey } from '../../i18n/messages';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { formatPaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { listProperties, type Property } from '../properties/propertyStore';
import { RentalLocation } from '../tenancies/RentalLocation';
import { BillChoice } from './BillChoice';
import { BillDraftForm } from './BillDraftForm';
import { matchesBillScope, type BillScope } from './billFilters';
import {
  getBillingTenancy,
  listBills,
  outstandingPaisa,
  type Bill,
  type BillingTenancy,
} from './billStore';
import {
  billDate,
  billError,
  billMonth,
  billStatus,
  billIsOverdue,
} from './billPresentation';

type State =
  | { status: 'loading' }
  | { status: 'error'; error: MessageKey }
  | {
      status: 'ready';
      bills: Bill[];
      properties: Property[];
      tenancy?: BillingTenancy;
    };
function totalFor(bills: Bill[]): { amount: number } | { error: MessageKey } {
  try {
    return { amount: outstandingPaisa(bills) };
  } catch (error) {
    return { error: billError(error) };
  }
}
export function BillListScreen({
  tenancyId,
  revision,
  onBack,
  onOpenBill,
  onOpenProperties,
  onChanged,
  initialScope,
}: {
  tenancyId?: number;
  revision: number;
  onBack?: () => void;
  onOpenBill: (id: number) => void;
  onOpenProperties: () => void;
  onChanged: () => void;
  initialScope?: BillScope;
}) {
  const { t, locale } = useLocale(),
    focused = useIsFocused();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0),
    [property, setProperty] = useState(
      initialScope?.propertyId === undefined
        ? 'all'
        : String(initialScope.propertyId),
    ),
    [month, setMonth] = useState(initialScope?.month ?? 'all'),
    [status, setStatus] = useState(initialScope?.status ?? 'all'),
    [includeVoids, setIncludeVoids] = useState(false),
    [creating, setCreating] = useState(false);
  useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      if (status === 'active') setAttempt((n) => n + 1);
    });
    return () => listener.remove();
  }, []);
  useEffect(() => {
    if (!focused) return;
    let active = true;
    async function load() {
      try {
        const db = await getDatabase();
        const [bills, properties, tenancy] = await Promise.all([
          listBills(db, tenancyId),
          listProperties(db),
          tenancyId === undefined
            ? undefined
            : getBillingTenancy(db, tenancyId),
        ]);
        if (tenancyId !== undefined && !tenancy) {
          if (active) setState({ status: 'error', error: 'billMissing' });
          return;
        }
        if (active) setState({ status: 'ready', bills, properties, tenancy });
      } catch {
        if (active) setState({ status: 'error', error: 'billLoadError' });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [tenancyId, revision, attempt, focused]);
  const bills = state.status === 'ready' ? state.bills : [];
  const visible = bills.filter(
    (bill) =>
      matchesBillScope(bill, {
        propertyId: property === 'all' ? undefined : Number(property),
        month: month === 'all' ? undefined : month,
        status,
      }) &&
      (includeVoids || bill.status !== 'void'),
  );
  const months = [
      ...new Set([
        ...bills.map((bill) => bill.month),
        ...(month === 'all' ? [] : [month]),
      ]),
    ]
      .sort()
      .reverse(),
    total = totalFor(visible);
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={styles.heading}>
        {onBack && (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('back')}
            onPress={onBack}
            style={[surfaces.control, styles.back]}
          >
            <AssetIcon name="back" />
          </Pressable>
        )}
        <AppText variant="title" accessibilityRole="header">
          {t('bills')}
        </AppText>
      </View>
      <FlatList
        data={visible}
        keyExtractor={(bill) => String(bill.id)}
        contentContainerStyle={styles.body}
        ListHeaderComponent={
          <View style={styles.header}>
            {state.status === 'ready' && state.tenancy && (
              <>
                <RentalLocation
                  propertyName={state.tenancy.propertyName}
                  floorName={state.tenancy.floorName}
                  unitName={state.tenancy.unitName}
                />
                <AppText>{state.tenancy.tenantName}</AppText>
                {!state.tenancy.endedOn && (
                  <PrimaryButton
                    label={t('billCreate')}
                    onPress={() => setCreating(true)}
                  />
                )}
              </>
            )}
            {tenancyId === undefined && (
              <BillChoice
                label={t('billProperty')}
                value={property}
                onChange={setProperty}
                options={[
                  { value: 'all', label: t('billAllProperties') },
                  ...(state.status === 'ready'
                    ? state.properties.map((item) => ({
                        value: String(item.id),
                        label: `${item.name} · ${item.location}`,
                      }))
                    : []),
                ]}
              />
            )}
            <BillChoice
              label={t('billMonth')}
              value={month}
              onChange={setMonth}
              options={[
                { value: 'all', label: t('billAllMonths') },
                ...months.map((value) => ({
                  value,
                  label: billMonth(value, locale),
                })),
              ]}
            />
            <Pressable
              accessibilityRole="checkbox"
              accessibilityLabel={t('billIncludeVoids')}
              accessibilityState={{ checked: includeVoids }}
              onPress={() => setIncludeVoids((current) => !current)}
              style={styles.checkbox}
            >
              <AppText color={colors.brand}>
                {includeVoids ? '☑' : '☐'} {t('billIncludeVoids')}
              </AppText>
            </Pressable>
            <BillChoice
              label={t('billFilterLabel')}
              value={status}
              options={[
                { value: 'all', label: t('billFilterAll') },
                { value: 'outstanding', label: t('billUnpaid') },
                { value: 'draft', label: t('billDraft') },
                { value: 'overdue', label: t('billOverdue') },
              ]}
              onChange={(value) => {
                if (
                  value === 'all' ||
                  value === 'outstanding' ||
                  value === 'draft' ||
                  value === 'overdue'
                )
                  setStatus(value);
              }}
            />
            {state.status === 'ready' && (
              <>
                <AppText variant="label" color={colors.muted}>
                  {t('billOutstanding')}
                </AppText>
                {'amount' in total ? (
                  <AppText variant="heading">
                    {formatPaisa(total.amount, locale)}
                  </AppText>
                ) : (
                  <AppText accessibilityRole="alert" color={colors.error}>
                    {t(total.error)}
                  </AppText>
                )}
                <AppText variant="label" color={colors.muted}>
                  {t('billScopeHint')}
                </AppText>
              </>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('billCardAnnouncement', {
              month: billMonth(item.month, locale),
              tenant: item.tenantName,
              property: item.propertyName,
              floor: item.floorName,
              unit: item.unitName,
              status: billIsOverdue(item)
                ? t('paymentStatusOverdue', { status: t(billStatus(item)) })
                : t(billStatus(item)),
              amount: formatPaisa(item.amountPaisa, locale),
              outstanding: formatPaisa(item.outstandingPaisa, locale),
              due: billDate(item.dueDate, locale),
            })}
            onPress={() => onOpenBill(item.id)}
            style={[surfaces.card, styles.card]}
          >
            {item.status === 'finalized' && (
              <AppText>
                {t('billOutstanding')}:{' '}
                {formatPaisa(item.outstandingPaisa, locale)}
              </AppText>
            )}
            <AppText variant="heading">{billMonth(item.month, locale)}</AppText>
            <AppText color={colors.brand}>{t(billStatus(item))}</AppText>
            {billIsOverdue(item) && (
              <AppText color={colors.error}>{t('billOverdue')}</AppText>
            )}
            <AppText variant="heading">
              {formatPaisa(item.amountPaisa, locale)}
            </AppText>
            <RentalLocation
              propertyName={item.propertyName}
              floorName={item.floorName}
              unitName={item.unitName}
            />
            <AppText>{item.tenantName}</AppText>
            <AppText variant="label" color={colors.muted}>
              {t('billDue')}: {billDate(item.dueDate, locale)}
            </AppText>
          </Pressable>
        )}
        ListEmptyComponent={
          <View style={styles.header}>
            {state.status === 'loading' ? (
              <>
                <ActivityIndicator color={colors.brand} />
                <AppText>{t('billLoading')}</AppText>
              </>
            ) : state.status === 'error' ? (
              <>
                <AppText accessibilityRole="alert">{t(state.error)}</AppText>
                <PrimaryButton
                  label={t('retry')}
                  onPress={() => {
                    setState({ status: 'loading' });
                    setAttempt((n) => n + 1);
                  }}
                />
              </>
            ) : (
              <>
                <AppText variant="heading">
                  {t(bills.length ? 'billNoMatches' : 'billEmpty')}
                </AppText>
                {tenancyId === undefined && !bills.length && (
                  <>
                    <AppText>{t('billEmptyBody')}</AppText>
                    <PrimaryButton
                      label={t('billOpenProperties')}
                      onPress={onOpenProperties}
                    />
                  </>
                )}
              </>
            )}
          </View>
        }
      />
      {creating && tenancyId !== undefined && (
        <BillDraftForm
          tenancyId={tenancyId}
          onClose={() => setCreating(false)}
          onSaved={(id) => {
            setCreating(false);
            onChanged();
            onOpenBill(id);
          }}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  heading: { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  body: { padding: 20, paddingBottom: 44, gap: 16 },
  header: { gap: 16, paddingBottom: 12 },
  card: { padding: 20, gap: 12 },
  back: {
    width: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: { minHeight: 52, justifyContent: 'center' },
});
