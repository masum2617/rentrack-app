import { tenancyBillSummary } from '../ledger/billStore';
import { PaymentActions } from '../ledger/PaymentActions';
import { formatPaisa } from '../../shared/money/paisa';
import { EditButton } from '../../shared/ui/EditButton';
import { TenantLink } from '../tenants/TenantLink';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../../i18n/LocaleProvider';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { fontFamilies } from '../../theme/typography';
import {
  getCurrentTenancy,
  type CurrentTenancy,
} from '../tenancies/tenancyStore';
import { TenancyTerms } from '../tenancies/TenancyTerms';
import { UnitChargeSettings } from '../tenancies/UnitChargeSettings';
import { getUnitContext, type UnitContext } from './unitContext';
import { UnitRow } from './UnitRow';

type State =
  | { status: 'loading' | 'error' | 'missing' }
  | {
      status: 'ready';
      context: UnitContext;
      tenancy?: CurrentTenancy;
      billing?: { outstandingPaisa: number; finalizedCount: number };
    };
export function UnitDetailsScreen({
  unitId,
  revision,
  notice,
  onBack,
  onEdit,
  onStart,
  onCorrect,
  onOpenTenant,
  onOpenBills,
  onBillingChanged,
  onPaymentHistory,
  onReceipt,
}: {
  unitId: number;
  revision: number;
  notice: boolean;
  onOpenBills: (tenancyId: number) => void;
  onBillingChanged: () => void;
  onPaymentHistory: (tenancyId: number) => void;
  onReceipt: (paymentId: number) => void;
  onBack: () => void;
  onEdit: (context: UnitContext) => void;
  onStart: (context: UnitContext) => void;
  onOpenTenant: (tenantId: number, unitId: number) => void;
  onCorrect: (context: UnitContext, tenancy: CurrentTenancy) => void;
}) {
  const { t, locale } = useLocale();
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const db = await getDatabase();
        const [context, tenancy] = await Promise.all([
          getUnitContext(db, unitId),
          getCurrentTenancy(db, unitId),
        ]);
        const billing = tenancy
          ? await tenancyBillSummary(db, tenancy.id)
          : undefined;
        if (active)
          setState(
            context
              ? { status: 'ready', context, tenancy, billing }
              : { status: 'missing' },
          );
      } catch {
        if (active) setState({ status: 'error' });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [unitId, revision, attempt]);
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={styles.heading}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          onPress={onBack}
          style={[surfaces.control, styles.back]}
        >
          <AssetIcon name="back" />
        </Pressable>
        <AppText variant="title" accessibilityRole="header" style={styles.grow}>
          {t('unitDetails')}
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        {state.status === 'ready' ? (
          <>
            <View style={styles.context}>
              <AppText
                variant="heading"
                style={
                  /[\u0980-\u09ff]/.test(state.context.property.name)
                    ? { fontFamily: fontFamilies.bn.semibold }
                    : undefined
                }
              >
                {state.context.property.name}
              </AppText>
              <AppText color={colors.muted}>
                {state.context.floor.name} · {state.context.property.location}
              </AppText>
            </View>
            <UnitRow
              unit={state.context.unit}
              onEdit={() => onEdit(state.context)}
            />
            {notice && (
              <AppText accessibilityLiveRegion="polite" color={colors.brand}>
                {t('tenancySaved')}
              </AppText>
            )}
            <View style={[surfaces.card, styles.rental]}>
              <AppText variant="heading" accessibilityRole="header">
                {t(state.tenancy ? 'unitOccupied' : 'unitVacant')}
              </AppText>
              {state.tenancy ? (
                <>
                  <TenantLink
                    name={state.tenancy.tenantName}
                    onPress={() => {
                      if (state.tenancy)
                        onOpenTenant(state.tenancy.tenantId, unitId);
                    }}
                  />
                  <AppText color={colors.muted}>
                    {state.tenancy.tenantPhone || t('tenantPhoneMissing')}
                  </AppText>
                  <View style={styles.termsHeading}>
                    <AppText
                      variant="heading"
                      accessibilityRole="header"
                      style={styles.grow}
                    >
                      {t('tenancyEnterTerms')}
                    </AppText>
                    {!state.billing?.finalizedCount && (
                      <EditButton
                        label={t('correctTenancy')}
                        onPress={() => {
                          if (state.tenancy)
                            onCorrect(state.context, state.tenancy);
                        }}
                      />
                    )}
                  </View>
                  {Boolean(state.billing?.finalizedCount) && (
                    <AppText variant="label" color={colors.muted}>
                      {t('billTermsLocked')}
                    </AppText>
                  )}
                  <TenancyTerms terms={state.tenancy} />
                  <UnitChargeSettings
                    key={state.tenancy.id}
                    tenancyId={state.tenancy.id}
                    revision={revision}
                  />
                  <AppText variant="label" color={colors.muted}>
                    {t('billOutstanding')}
                  </AppText>
                  <AppText variant="heading">
                    {formatPaisa(state.billing?.outstandingPaisa ?? 0, locale)}
                  </AppText>
                  <PrimaryButton
                    label={t('bills')}
                    onPress={() => {
                      if (state.tenancy) onOpenBills(state.tenancy.id);
                    }}
                  />
                  <PaymentActions
                    tenancyId={state.tenancy.id}
                    canRecord={Boolean(state.billing?.outstandingPaisa)}
                    onChanged={onBillingChanged}
                    onReceipt={onReceipt}
                    onHistory={() => {
                      if (state.tenancy) onPaymentHistory(state.tenancy.id);
                    }}
                  />
                  <AppText variant="label" color={colors.muted}>
                    {t('tenancyTermsOnly')}
                  </AppText>
                </>
              ) : (
                <>
                  <AppText color={colors.muted}>
                    {t('tenancyVacantBody')}
                  </AppText>
                  <PrimaryButton
                    label={t('startTenancy')}
                    onPress={() => onStart(state.context)}
                  />
                </>
              )}
            </View>
          </>
        ) : state.status === 'loading' ? (
          <>
            <ActivityIndicator color={colors.brand} />
            <AppText>{t('tenancyLoading')}</AppText>
          </>
        ) : (
          <>
            <AppText accessibilityRole="alert">
              {t(
                state.status === 'missing'
                  ? 'tenancyUnitMissing'
                  : 'tenancyLoadError',
              )}
            </AppText>
            <PrimaryButton
              label={t(state.status === 'missing' ? 'back' : 'retry')}
              onPress={
                state.status === 'missing'
                  ? onBack
                  : () => {
                      setState({ status: 'loading' });
                      setAttempt((n) => n + 1);
                    }
              }
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12, padding: 20 },
  grow: { flex: 1 },
  back: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: { padding: 20, paddingBottom: 44, gap: 20 },
  context: { gap: 8 },
  termsHeading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  rental: { padding: 20, gap: 20 },
});
