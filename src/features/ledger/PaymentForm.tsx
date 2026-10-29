import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
  type ComponentRef,
} from 'react';
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Modal,
  View,
  type TextInputInstance,
} from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { FormField } from '../../shared/ui/FormField';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { formatPaisa, parsePaisa } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { RentalLocation } from '../tenancies/RentalLocation';
import { localDate } from '../tenancies/tenancyValidation';
import { BillChoice } from './BillChoice';
import { safeTotal } from './billCalculations';
import { getBill, getBillingTenancy, type BillingTenancy } from './billStore';
import {
  listDueLines,
  newPaymentOperation,
  recordPayment,
} from './paymentStore';
import {
  PaymentError,
  paymentValues,
  allocationValues,
  suggestAllocations,
  validateAllocations,
  type PaymentInput,
  type DueLine,
  type AllocationInput,
} from './paymentValidation';
import { paymentError } from './paymentPresentation';
import { PaymentFormFrame } from './PaymentFormFrame';
import { PaymentDateField } from './PaymentDateField';
import { PaymentAllocationFields } from './PaymentAllocationFields';
import { PaymentReview } from './PaymentReview';

type Handle = { close: () => void };
type Loaded =
  | { status: 'loading' }
  | { status: 'error' | 'missing' }
  | {
      status: 'ready';
      tenancy: BillingTenancy;
      due: DueLine[];
      operationId: string;
    };
export function PaymentForm({
  tenancyId,
  billId,
  onClose,
  onSaved,
}: {
  tenancyId: number;
  billId?: number;
  onClose: () => void;
  onSaved: (id: number) => void;
}) {
  const { t } = useLocale();
  const [state, setState] = useState<Loaded>({ status: 'loading' }),
    [attempt, setAttempt] = useState(0);
  const body = useRef<Handle>(null);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const db = await getDatabase();
        const [tenancy, due, operationId, bill] = await Promise.all([
          getBillingTenancy(db, tenancyId),
          listDueLines(db, tenancyId),
          newPaymentOperation(db),
          billId === undefined ? undefined : getBill(db, billId),
        ]);
        if (
          !tenancy ||
          (billId !== undefined &&
            (!bill ||
              bill.tenancyId !== tenancyId ||
              bill.status !== 'finalized'))
        ) {
          if (active) setState({ status: 'missing' });
          return;
        }
        if (active) setState({ status: 'ready', tenancy, due, operationId });
      } catch {
        if (active) setState({ status: 'error' });
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
        <PaymentBody
          ref={body}
          tenancy={state.tenancy}
          initialDue={state.due}
          operationId={state.operationId}
          billId={billId}
          onClose={onClose}
          onSaved={onSaved}
        />
      ) : (
        <PaymentFormFrame
          title={t('paymentRecord')}
          busy={false}
          onBack={onClose}
        >
          {state.status === 'loading' ? (
            <ActivityIndicator color={colors.brand} />
          ) : (
            <>
              <AppText accessibilityRole="alert">
                {t(
                  state.status === 'missing'
                    ? 'paymentMissing'
                    : 'paymentReadError',
                )}
              </AppText>
              {state.status === 'error' && (
                <PrimaryButton
                  label={t('retry')}
                  onPress={() => {
                    setState({ status: 'loading' });
                    setAttempt((n) => n + 1);
                  }}
                />
              )}
            </>
          )}
        </PaymentFormFrame>
      )}
    </Modal>
  );
}
function PaymentBody({
  tenancy,
  initialDue,
  operationId,
  billId,
  onClose,
  onSaved,
  ref,
}: {
  tenancy: BillingTenancy;
  initialDue: DueLine[];
  operationId: string;
  billId?: number;
  onClose: () => void;
  onSaved: (id: number) => void;
  ref: Ref<Handle>;
}) {
  const { t, locale } = useLocale();
  const [initial] = useState<PaymentInput>(() => ({
    amount: '',
    receivedOn: localDate(),
    method: '',
    reference: '',
    notes: '',
  }));
  const [input, setInput] = useState(initial),
    [due, setDue] = useState(initialDue);
  const [allocation, setAllocation] = useState<AllocationInput[]>(() =>
    suggestAllocations(initialDue, 0, billId),
  );
  const [step, setStep] = useState<'entry' | 'review'>('entry'),
    [busy, setBusy] = useState(false),
    [error, setError] = useState<unknown>();
  const amountRef = useRef<TextInputInstance>(null),
    dateRef = useRef<ComponentRef<typeof View>>(null),
    methodRef = useRef<ComponentRef<typeof View>>(null),
    inFlight = useRef(false);
  const typedError = error instanceof PaymentError ? error : undefined;
  useEffect(() => {
    if (
      typedError?.code === 'amount' ||
      typedError?.code === 'excess' ||
      (typedError?.code === 'allocation' && !typedError.lineId)
    )
      amountRef.current?.focus();
    else if (typedError?.code === 'date') dateRef.current?.focus();
    else if (typedError?.code === 'method') methodRef.current?.focus();
  }, [typedError]);
  const dirty =
    JSON.stringify(input) !== JSON.stringify(initial) ||
    allocation.some((entry) => Boolean(parsePaisa(entry.amount)));
  let allocated = 0,
    invalidAllocation = false;
  try {
    allocated = safeTotal(
      allocationValues(allocation).map((entry) => entry.amountPaisa),
    );
  } catch {
    invalidAllocation = true;
  }
  const received = parsePaisa(input.amount) ?? 0;
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
  function back() {
    if (inFlight.current) return;
    if (step === 'review') setStep('entry');
    else close();
  }
  useImperativeHandle(ref, () => ({ close: back }));
  function change(field: keyof PaymentInput, value: string) {
    if (field === 'method') return;
    setInput((old) => ({ ...old, [field]: value }));
    setError(undefined);
    if (field === 'amount')
      setAllocation(suggestAllocations(due, parsePaisa(value) ?? 0, billId));
  }
  function validate() {
    const values = paymentValues(input);
    const allocations = allocationValues(allocation);
    validateAllocations(values.amountPaisa, allocations, due);
    return { values, allocations };
  }
  function next() {
    Keyboard.dismiss();
    try {
      validate();
      setError(undefined);
      setStep('review');
    } catch (caught) {
      setError(caught);
    }
  }
  async function save() {
    if (inFlight.current) return;
    try {
      const { allocations } = validate();
      inFlight.current = true;
      setBusy(true);
      setError(undefined);
      const id = await recordPayment(
        await getDatabase(),
        tenancy.id,
        operationId,
        input,
        allocations,
      );
      onSaved(id);
    } catch (caught) {
      setError(caught);
      setStep('entry');
      inFlight.current = false;
      setBusy(false);
    }
  }
  function refresh() {
    Alert.alert(t('paymentRefresh'), t('paymentRefreshBody'), [
      { text: t('billCancel'), style: 'cancel' },
      {
        text: t('paymentRefresh'),
        onPress: () => {
          void loadDue();
        },
      },
    ]);
  }
  async function loadDue() {
    if (inFlight.current) return;
    inFlight.current = true;
    setBusy(true);
    try {
      const current = await listDueLines(await getDatabase(), tenancy.id);
      setDue(current);
      setAllocation(
        suggestAllocations(current, parsePaisa(input.amount) ?? 0, billId),
      );
      setError(undefined);
      setStep('entry');
    } catch (caught) {
      setError(caught);
    } finally {
      inFlight.current = false;
      setBusy(false);
    }
  }
  return (
    <PaymentFormFrame
      title={t(step === 'review' ? 'paymentReview' : 'paymentRecord')}
      busy={busy}
      onBack={back}
      footer={
        <>
          {error !== undefined && (
            <AppText accessibilityRole="alert" color={colors.error}>
              {t(paymentError(error))}
            </AppText>
          )}
          {typedError?.paymentId !== undefined && (
            <PrimaryButton
              label={t('paymentOpenReceipt')}
              onPress={() => {
                if (typedError.paymentId !== undefined)
                  onSaved(typedError.paymentId);
              }}
            />
          )}
          {due.length > 0 && (
            <PrimaryButton
              label={t(
                busy
                  ? 'savingHouse'
                  : step === 'review'
                    ? 'paymentSave'
                    : 'paymentNext',
              )}
              busy={busy}
              onPress={step === 'review' ? save : next}
            />
          )}
        </>
      }
    >
      <RentalLocation
        propertyName={tenancy.propertyName}
        floorName={tenancy.floorName}
        unitName={tenancy.unitName}
      />
      <AppText>{tenancy.tenantName}</AppText>
      <AppText color={colors.muted}>{t('paymentActualHint')}</AppText>
      {!due.length ? (
        <AppText>{t('paymentNoDues')}</AppText>
      ) : step === 'entry' ? (
        <>
          <FormField
            label={t('paymentAmount')}
            value={input.amount}
            placeholder={t('billAmountExample')}
            editable={!busy}
            keyboardType="decimal-pad"
            inputRef={amountRef}
            error={
              typedError?.code === 'amount' || typedError?.code === 'excess'
                ? t(paymentError(error))
                : undefined
            }
            onChangeText={(value) => change('amount', value)}
          />
          <PaymentDateField
            value={input.receivedOn}
            disabled={busy}
            error={
              typedError?.code === 'date' ? t('paymentDateError') : undefined
            }
            controlRef={dateRef}
            onChange={(value) => change('receivedOn', value)}
          />
          <BillChoice
            controlRef={methodRef}
            label={t('paymentMethod')}
            value={input.method}
            disabled={busy}
            options={[
              { value: '', label: t('paymentChooseMethod') },
              { value: 'cash', label: t('paymentCash') },
              { value: 'bank', label: t('paymentBank') },
              { value: 'wallet', label: t('paymentWallet') },
            ]}
            onChange={(method) => {
              if (
                method === 'cash' ||
                method === 'bank' ||
                method === 'wallet' ||
                method === ''
              ) {
                setInput((old) => ({ ...old, method }));
                setError(undefined);
              }
            }}
          />
          {typedError?.code === 'method' && (
            <AppText accessibilityRole="alert" color={colors.error}>
              {t('paymentMethodError')}
            </AppText>
          )}
          <FormField
            label={t('paymentTransaction')}
            value={input.reference}
            placeholder={t('paymentOptionalPlaceholder')}
            editable={!busy}
            onChangeText={(value) => change('reference', value)}
          />
          <FormField
            label={t('paymentNotes')}
            value={input.notes}
            placeholder={t('paymentOptionalPlaceholder')}
            editable={!busy}
            multiline
            onChangeText={(value) => change('notes', value)}
          />
          <AppText variant="heading">{t('paymentAllocate')}</AppText>
          <AppText variant="label" color={colors.muted}>
            {t(billId === undefined ? 'paymentOldestHint' : 'paymentBillHint')}
          </AppText>
          <PrimaryButton
            label={t('paymentSuggest')}
            disabled={busy}
            onPress={() => {
              setAllocation(suggestAllocations(due, received, billId));
              setError(undefined);
            }}
          />
          {due.map((line) => (
            <PaymentAllocationFields
              key={line.lineId}
              line={line}
              amount={
                allocation.find((entry) => entry.lineId === line.lineId)
                  ?.amount ?? ''
              }
              disabled={busy}
              error={
                typedError?.lineId === line.lineId ? typedError : undefined
              }
              onChange={(value) => {
                setAllocation((old) =>
                  old.map((entry) =>
                    entry.lineId === line.lineId
                      ? { ...entry, amount: value }
                      : entry,
                  ),
                );
                setError(undefined);
              }}
            />
          ))}
          <AppText>
            {invalidAllocation
              ? t('paymentAllocationError')
              : t('paymentAllocated', {
                  amount: formatPaisa(allocated, locale),
                })}
          </AppText>
          {!invalidAllocation && (
            <AppText>
              {t(
                allocated > received
                  ? 'paymentOverallocated'
                  : 'paymentUnallocated',
                { amount: formatPaisa(Math.abs(received - allocated), locale) },
              )}
            </AppText>
          )}
          <PrimaryButton
            label={t('paymentRefresh')}
            disabled={busy}
            onPress={refresh}
          />
        </>
      ) : (
        <PaymentReview
          input={input}
          amount={received}
          allocations={allocationValues(allocation)}
          due={due}
        />
      )}
    </PaymentFormFrame>
  );
}
