import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  AppState,
  Pressable,
  ScrollView,
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
import { EditButton } from '../../shared/ui/EditButton';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { formatPaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { RentalLocation } from '../tenancies/RentalLocation';
import { BillDraftForm } from './BillDraftForm';
import { BillVoidForm } from './BillVoidForm';
import { BillFigures } from './BillFigures';
import { BillItems } from './BillItems';
import { PaymentActions } from './PaymentActions';
import { getBill, finalizeBill, discardDraft, type Bill } from './billStore';
import {
  billError,
  billMonth,
  billStatus,
  billIsOverdue,
} from './billPresentation';

type State =
  | { status: 'loading' | 'error' | 'missing' }
  | { status: 'ready'; bill: Bill };
export function BillDetailsScreen({
  billId,
  revision,
  onBack,
  onReplace,
  onChanged,
  onPaymentHistory,
  onReceipt,
}: {
  billId: number;
  revision: number;
  onBack: () => void;
  onReplace: (id: number) => void;
  onChanged: () => void;
  onPaymentHistory: (tenancyId: number, billId: number) => void;
  onReceipt: (paymentId: number) => void;
}) {
  const { t, locale, number } = useLocale(),
    focused = useIsFocused();
  const [state, setState] = useState<State>({ status: 'loading' }),
    [attempt, setAttempt] = useState(0);
  const [editing, setEditing] = useState(false),
    [voiding, setVoiding] = useState(false),
    [reissuing, setReissuing] = useState(false),
    [saving, setSaving] = useState(false),
    [notice, setNotice] = useState(false),
    [failure, setFailure] = useState<MessageKey>();
  const inFlight = useRef(false),
    confirming = useRef(false);
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
        const bill = await getBill(await getDatabase(), billId);
        if (active)
          setState(bill ? { status: 'ready', bill } : { status: 'missing' });
      } catch {
        if (active) setState({ status: 'error' });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [billId, revision, attempt, focused]);
  function changed() {
    setNotice(true);
    setFailure(undefined);
    onChanged();
  }
  async function mutate(action: 'finalize' | 'discard') {
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    setFailure(undefined);
    try {
      const db = await getDatabase();
      if (action === 'finalize') {
        await finalizeBill(db, billId);
        changed();
      } else {
        await discardDraft(db, billId);
        onChanged();
        onBack();
      }
    } catch (error) {
      setFailure(billError(error));
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  }
  function confirm(action: 'finalize' | 'discard') {
    if (inFlight.current || confirming.current) return;
    confirming.current = true;
    Alert.alert(
      t(action === 'finalize' ? 'billFinalizeConfirm' : 'billDiscardConfirm'),
      t(action === 'finalize' ? 'billFinalizeBody' : 'billDiscardBody'),
      [
        {
          text: t('billCancel'),
          style: 'cancel',
          onPress: () => {
            confirming.current = false;
          },
        },
        {
          text: t(action === 'finalize' ? 'billFinalize' : 'billDiscard'),
          style: action === 'discard' ? 'destructive' : 'default',
          onPress: () => {
            confirming.current = false;
            void mutate(action);
          },
        },
      ],
      {
        cancelable: true,
        onDismiss: () => {
          confirming.current = false;
        },
      },
    );
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={styles.heading}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('back')}
          disabled={saving}
          onPress={onBack}
          style={[surfaces.control, styles.back]}
        >
          <AssetIcon name="back" />
        </Pressable>
        <AppText variant="title" accessibilityRole="header" style={styles.grow}>
          {t('bills')}
        </AppText>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        {state.status === 'ready' ? (
          <>
            <View style={[surfaces.card, styles.card]}>
              <View style={styles.headingRow}>
                <AppText variant="heading" style={styles.grow}>
                  {billMonth(state.bill.month, locale)}
                </AppText>
                {state.bill.status === 'draft' && (
                  <EditButton
                    label={t('billEditDraft')}
                    disabled={saving}
                    onPress={() => {
                      setNotice(false);
                      setEditing(true);
                    }}
                  />
                )}
              </View>
              <AppText variant="label" color={colors.muted}>
                {t('billReference', { id: number(state.bill.id) })}
              </AppText>
              <AppText color={colors.brand}>
                {t(billStatus(state.bill))}
              </AppText>
              {billIsOverdue(state.bill) && (
                <AppText color={colors.error}>{t('billOverdue')}</AppText>
              )}
              <RentalLocation
                propertyName={state.bill.propertyName}
                floorName={state.bill.floorName}
                unitName={state.bill.unitName}
              />
              <AppText>{state.bill.tenantName}</AppText>
              <BillFigures
                proposal={state.bill}
                amountPaisa={state.bill.rentAmountPaisa}
                reason={state.bill.overrideReason}
              />
              <BillItems bill={state.bill} />
              <AppText variant="label" color={colors.muted}>
                {t('billOutstanding')}
              </AppText>
              <AppText variant="heading">
                {formatPaisa(
                  state.bill.status === 'finalized'
                    ? state.bill.outstandingPaisa
                    : 0,
                  locale,
                )}
              </AppText>
              {state.bill.status === 'void' && (
                <>
                  <AppText variant="label" color={colors.muted}>
                    {t('billVoidReason')}
                  </AppText>
                  <AppText>{state.bill.voidReason}</AppText>
                </>
              )}
            </View>
            {notice && (
              <AppText accessibilityLiveRegion="polite" color={colors.brand}>
                {t('billSaved')}
              </AppText>
            )}
            {failure && (
              <AppText accessibilityRole="alert" color={colors.error}>
                {t(failure)}
              </AppText>
            )}
            {state.bill.status !== 'draft' && (
              <PaymentActions
                tenancyId={state.bill.tenancyId}
                billId={billId}
                canRecord={
                  state.bill.status === 'finalized' &&
                  state.bill.outstandingPaisa > 0
                }
                onChanged={changed}
                onReceipt={onReceipt}
                onHistory={() => onPaymentHistory(state.bill.tenancyId, billId)}
              />
            )}
            {state.bill.status === 'draft' ? (
              <>
                <AppText color={colors.muted}>{t('billDraftHint')}</AppText>
                <PrimaryButton
                  label={t(saving ? 'savingHouse' : 'billFinalize')}
                  busy={saving}
                  onPress={() => confirm('finalize')}
                />
                <PrimaryButton
                  label={t('billDiscard')}
                  disabled={saving}
                  onPress={() => confirm('discard')}
                />
              </>
            ) : state.bill.status === 'finalized' ? (
              <>
                <AppText color={colors.muted}>{t('billFinalHint')}</AppText>
                <PrimaryButton
                  label={t('billVoid')}
                  disabled={saving || state.bill.paidPaisa > 0}
                  onPress={() => setVoiding(true)}
                />
                {state.bill.paidPaisa > 0 && (
                  <AppText color={colors.muted}>
                    {t('paymentBillLocked')}
                  </AppText>
                )}
              </>
            ) : (
              <PrimaryButton
                label={t('billReissue')}
                onPress={() => setReissuing(true)}
              />
            )}
          </>
        ) : state.status === 'loading' ? (
          <>
            <ActivityIndicator color={colors.brand} />
            <AppText>{t('billLoading')}</AppText>
          </>
        ) : (
          <>
            <AppText accessibilityRole="alert">
              {t(state.status === 'missing' ? 'billMissing' : 'billLoadError')}
            </AppText>
            <PrimaryButton
              label={t('retry')}
              onPress={() => {
                setState({ status: 'loading' });
                setAttempt((n) => n + 1);
              }}
            />
          </>
        )}
      </ScrollView>
      {state.status === 'ready' && (editing || reissuing) && (
        <BillDraftForm
          tenancyId={state.bill.tenancyId}
          billId={editing ? billId : undefined}
          initialMonth={state.bill.month}
          onClose={() => {
            setEditing(false);
            setReissuing(false);
          }}
          onSaved={(id) => {
            setEditing(false);
            setReissuing(false);
            changed();
            if (id !== billId) onReplace(id);
          }}
        />
      )}
      {voiding && (
        <BillVoidForm
          billId={billId}
          onClose={() => setVoiding(false)}
          onSaved={() => {
            setVoiding(false);
            changed();
          }}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  heading: { padding: 20, flexDirection: 'row', alignItems: 'center', gap: 12 },
  headingRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  grow: { flex: 1 },
  back: {
    width: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  body: { padding: 20, paddingBottom: 44, gap: 20 },
  card: { padding: 20, gap: 20 },
});
