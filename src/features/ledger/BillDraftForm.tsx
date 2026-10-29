import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type TextInputInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../../i18n/LocaleProvider';
import type { MessageKey } from '../../i18n/messages';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { FormField } from '../../shared/ui/FormField';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { paisaInput, parsePaisa, formatPaisa } from '../../shared/money/paisa';
import {
  applicableCharges,
  chargeSignature,
  listChargeVersions,
  type ChargeVersion,
} from '../tenancies/chargeSettings';
import {
  initialExtras,
  savedExtras,
  prepareExtras,
  type ExtraInput,
} from './additionalCharges';
import { BillExtraFields, type ExtraFieldsHandle } from './BillExtraFields';
import { BillItems } from './BillItems';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { RentalLocation } from '../tenancies/RentalLocation';
import { localDate } from '../tenancies/tenancyValidation';
import {
  BillError,
  proposeBill,
  reviewedAmount,
  sourceSignature,
  safeTotal,
} from './billCalculations';
import {
  getBill,
  getBillingTenancy,
  saveDraft,
  type Bill,
  type BillingTenancy,
} from './billStore';
import { billError } from './billPresentation';
import { BillMonthPicker } from './BillMonthPicker';
import { BillFigures } from './BillFigures';

type Handle = { close: () => void };
type Loaded =
  | { status: 'loading' }
  | { status: 'error'; error: MessageKey }
  | {
      status: 'ready';
      tenancy: BillingTenancy;
      bill?: Bill;
      versions: ChargeVersion[];
    };
export function BillDraftForm({
  tenancyId,
  billId,
  initialMonth,
  onClose,
  onSaved,
}: {
  tenancyId: number;
  billId?: number;
  initialMonth?: string;
  onClose: () => void;
  onSaved: (id: number) => void;
}) {
  const { t } = useLocale();
  const body = useRef<Handle>(null);
  const [state, setState] = useState<Loaded>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const db = await getDatabase();
        const [tenancy, bill, versions] = await Promise.all([
          getBillingTenancy(db, tenancyId),
          billId === undefined ? undefined : getBill(db, billId),
          listChargeVersions(db, tenancyId),
        ]);
        if (
          !tenancy ||
          (billId !== undefined && (!bill || bill.tenancyId !== tenancyId))
        )
          throw new BillError('missing');
        if (tenancy.endedOn) throw new BillError('closed');
        if (tenancy.startDate > localDate()) throw new BillError('month');
        if (bill && bill.status !== 'draft') throw new BillError('readonly');
        if (active) setState({ status: 'ready', tenancy, bill, versions });
      } catch (error) {
        if (active)
          setState({
            status: 'error',
            error:
              error instanceof BillError ? billError(error) : 'billLoadError',
          });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [tenancyId, billId, attempt]);
  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={() => (body.current ? body.current.close() : onClose())}
    >
      {state.status === 'ready' ? (
        <DraftBody
          ref={body}
          tenancy={state.tenancy}
          bill={state.bill}
          initialVersions={state.versions}
          initialMonth={initialMonth}
          onClose={onClose}
          onSaved={onSaved}
        />
      ) : (
        <SafeAreaView style={[styles.screen, styles.padding]}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('back')}
            onPress={onClose}
            style={[surfaces.control, styles.back]}
          >
            <AssetIcon name="back" />
          </Pressable>
          {state.status === 'loading' ? (
            <>
              <ActivityIndicator color={colors.brand} />
              <AppText>{t('billLoading')}</AppText>
            </>
          ) : (
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
          )}
        </SafeAreaView>
      )}
    </Modal>
  );
}
function DraftBody({
  tenancy: initialTenancy,
  bill,
  initialVersions,
  initialMonth,
  onClose,
  onSaved,
  ref,
}: {
  tenancy: BillingTenancy;
  initialVersions: ChargeVersion[];
  bill?: Bill;
  initialMonth?: string;
  onClose: () => void;
  onSaved: (id: number) => void;
  ref: Ref<Handle>;
}) {
  const { t, locale } = useLocale();
  const [tenancy, setTenancy] = useState(initialTenancy);
  const [versions, setVersions] = useState(initialVersions);
  const max = localDate().slice(0, 7),
    min = tenancy.startDate.slice(0, 7);
  const [initial] = useState(() => {
    const requested = bill?.month ?? initialMonth ?? max;
    // Saved drafts keep their original month/entries, even after a start-date correction.
    const month = bill
      ? bill.month
      : requested < min
        ? min
        : requested > max
          ? max
          : requested;
    const amount = paisaInput(
      bill ? bill.rentAmountPaisa : proposeBill(tenancy, month).proposedPaisa,
    );
    return {
      month,
      amount:
        locale === 'bn'
          ? amount.replace(/[0-9]/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])
          : amount,
      reason: bill && month === bill.month ? bill.overrideReason : '',
      extras:
        bill && month === bill.month
          ? savedExtras(bill.lines)
          : initialExtras(applicableCharges(initialVersions, month)),
    };
  });
  const [month, setMonth] = useState(initial.month),
    [amount, setAmount] = useState(initial.amount),
    [reason, setReason] = useState(initial.reason);
  const [extras, setExtras] = useState<ExtraInput[]>(initial.extras);
  const [stale, setStale] = useState(() =>
    Boolean(
      bill &&
        bill.chargeSignature !==
          chargeSignature(applicableCharges(initialVersions, initial.month)),
    ),
  );
  const extrasRef = useRef<ExtraFieldsHandle>(null);
  const version = applicableCharges(versions, month);
  const [saving, setSaving] = useState(false),
    [failure, setFailure] = useState<MessageKey>();
  const [fieldError, setFieldError] = useState<'amount' | 'reason'>();
  const inFlight = useRef(false),
    amountRef = useRef<TextInputInstance>(null),
    reasonRef = useRef<TextInputInstance>(null);
  const eligible = month >= min && month <= max;
  const proposal = bill && !eligible ? bill : proposeBill(tenancy, month),
    changed = parsePaisa(amount) !== proposal.proposedPaisa;
  const dirty =
    month !== initial.month ||
    amount !== initial.amount ||
    reason !== initial.reason ||
    JSON.stringify(extras) !== JSON.stringify(initial.extras);
  let total: number | undefined;
  let totalUnsafe = false;
  try {
    const rent = parsePaisa(amount);
    if (rent !== undefined && !stale && eligible)
      total = safeTotal([
        rent,
        ...prepareExtras(extras, version).map((line) => line.amountPaisa),
      ]);
  } catch (error) {
    totalUnsafe = error instanceof BillError && error.code === 'range';
  }
  function close() {
    if (inFlight.current) return;
    if (!dirty) {
      onClose();
      return;
    }
    Alert.alert(t('unsavedHouse'), t('unsavedHouseBody'), [
      { text: t('keepEditing'), style: 'cancel' },
      { text: t('discardChanges'), style: 'destructive', onPress: onClose },
    ]);
  }
  useImperativeHandle(ref, () => ({ close }));
  function changeMonth(next: string) {
    if (next === month || inFlight.current) return;
    function apply() {
      const nextAmount = paisaInput(proposeBill(tenancy, next).proposedPaisa);
      setMonth(next);
      setAmount(
        locale === 'bn'
          ? nextAmount.replace(/[0-9]/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)])
          : nextAmount,
      );
      setReason('');
      setExtras(initialExtras(applicableCharges(versions, next)));
      setStale(false);
      setFieldError(undefined);
      setFailure(undefined);
    }
    if (bill || changed || reason.trim() || extras.length)
      Alert.alert(t('billChangedMonth'), t('chargeMonthBody'), [
        { text: t('billCancel'), style: 'cancel' },
        { text: t('billRecalculate'), onPress: apply },
      ]);
    else apply();
  }
  async function save() {
    if (inFlight.current || stale || !eligible) return;
    try {
      reviewedAmount(amount, reason, proposal.proposedPaisa);
    } catch (error) {
      const field =
        error instanceof BillError && error.code === 'reason'
          ? 'reason'
          : 'amount';
      setFieldError(field);
      (field === 'reason' ? reasonRef : amountRef).current?.focus();
      return;
    }
    try {
      if (!extrasRef.current?.validate()) return;
      safeTotal([
        reviewedAmount(amount, reason, proposal.proposedPaisa),
        ...prepareExtras(extras, version).map((line) => line.amountPaisa),
      ]);
    } catch (error) {
      setFailure(billError(error));
      return;
    }
    inFlight.current = true;
    setSaving(true);
    setFailure(undefined);
    try {
      const id = await saveDraft(await getDatabase(), {
        tenancyId: tenancy.id,
        month,
        amount,
        reason,
        expectedSource: sourceSignature(tenancy),
        expectedCharges: chargeSignature(version),
        extras,
        billId: bill?.id,
      });
      onSaved(id);
    } catch (error) {
      setFailure(billError(error));
      if (error instanceof BillError && error.code === 'termsChanged')
        setStale(true);
      inFlight.current = false;
      setSaving(false);
    }
  }
  function refresh() {
    if (inFlight.current) return;
    Alert.alert(t('chargeRefresh'), t('chargeRefreshBody'), [
      { text: t('billCancel'), style: 'cancel' },
      {
        text: t('chargeRefresh'),
        onPress: () => {
          void reload();
        },
      },
    ]);
  }
  async function reload() {
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    try {
      const db = await getDatabase();
      const [current, freshVersions] = await Promise.all([
        getBillingTenancy(db, tenancy.id),
        listChargeVersions(db, tenancy.id),
      ]);
      if (!current) throw new BillError('missing');
      if (current.endedOn) throw new BillError('closed');
      proposeBill(current, month);
      setTenancy(current);
      setVersions(freshVersions);
      setExtras(initialExtras(applicableCharges(freshVersions, month)));
      setStale(false);
      setFailure(undefined);
    } catch (error) {
      setFailure(billError(error));
    } finally {
      inFlight.current = false;
      setSaving(false);
    }
  }
  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.bar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('back')}
            disabled={saving}
            onPress={close}
            style={[surfaces.control, styles.back]}
          >
            <AssetIcon name="back" />
          </Pressable>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={styles.padding}
        >
          <AppText variant="title" accessibilityRole="header">
            {t(bill ? 'billEditDraft' : 'billCreate')}
          </AppText>
          <RentalLocation
            propertyName={tenancy.propertyName}
            floorName={tenancy.floorName}
            unitName={tenancy.unitName}
          />
          <AppText>{tenancy.tenantName}</AppText>
          {bill && bill.sourceSignature !== sourceSignature(tenancy) && (
            <AppText color={colors.error}>{t('billTermsChanged')}</AppText>
          )}
          <BillMonthPicker
            value={month}
            min={min}
            max={max}
            disabled={saving}
            onChange={changeMonth}
          />
          {!eligible && (
            <AppText accessibilityRole="alert" color={colors.error}>
              {t('billMonthError')}
            </AppText>
          )}
          <BillFigures proposal={proposal} />
          <AppText variant="label" color={colors.muted}>
            {t('billHistoricalHint')}
          </AppText>
          <FormField
            label={t('billReviewedAmount')}
            value={amount}
            placeholder={t('billAmountExample')}
            editable={!saving && eligible}
            keyboardType="decimal-pad"
            inputRef={amountRef}
            error={fieldError === 'amount' ? t('billAmountError') : undefined}
            onChangeText={(value) => {
              setAmount(value);
              setFieldError(undefined);
              setFailure(undefined);
            }}
            returnKeyType="done"
          />
          {changed && (
            <FormField
              label={t('billReason')}
              value={reason}
              placeholder={t('billReasonExample')}
              editable={!saving && eligible}
              inputRef={reasonRef}
              multiline
              error={fieldError === 'reason' ? t('billReasonError') : undefined}
              onChangeText={(value) => {
                setReason(value);
                setFieldError(undefined);
                setFailure(undefined);
              }}
            />
          )}
          {stale || !eligible ? (
            <>
              {stale && (
                <AppText accessibilityRole="alert" color={colors.error}>
                  {t('chargeStale')}
                </AppText>
              )}
              {bill && <BillItems bill={bill} />}
            </>
          ) : (
            <BillExtraFields
              key={month}
              ref={extrasRef}
              input={extras}
              version={version}
              disabled={saving}
              onChange={(value) => {
                setExtras(value);
                setFailure(undefined);
              }}
            />
          )}
          <PrimaryButton
            label={t('chargeRefresh')}
            disabled={saving || !eligible}
            onPress={refresh}
          />
          <AppText variant="label">{t('chargeTotal')}</AppText>
          <AppText variant="heading">
            {total === undefined
              ? t(totalUnsafe ? 'billRangeError' : 'chargeTotalPending')
              : formatPaisa(total, locale)}
          </AppText>
        </ScrollView>
        <View style={styles.footer}>
          {failure && (
            <AppText accessibilityRole="alert" color={colors.error}>
              {t(failure)}
            </AppText>
          )}
          <PrimaryButton
            label={t(saving ? 'savingHouse' : 'billSaveDraft')}
            busy={saving}
            disabled={stale || !eligible}
            onPress={save}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  padding: { padding: 20, gap: 20 },
  bar: { paddingHorizontal: 20, paddingVertical: 8 },
  back: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: { padding: 20, gap: 12, backgroundColor: colors.surface },
});
