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
  View,
  type TextInputInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../../i18n/LocaleProvider';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { EditButton } from '../../shared/ui/EditButton';
import { FormField } from '../../shared/ui/FormField';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { latinDigits } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { RentalLocation } from './RentalLocation';
import { getBillingTenancy, type BillingTenancy } from '../ledger/billStore';
import { billMonth } from '../ledger/billPresentation';
import {
  applicableCharges,
  chargeInput,
  ChargeError,
  emptyChargeInput,
  listChargeVersions,
  parseChargeSettings,
  saveChargeVersion,
  type ChargeVersion,
} from './chargeSettings';
import { ChargeFields } from './ChargeFields';
import { ChargeSummary } from './ChargeSummary';
import { localDate } from './tenancyValidation';

type Handle = { close: () => void };
type Loaded =
  | { status: 'loading' | 'error' | 'missing' }
  | { status: 'ready'; tenancy: BillingTenancy; versions: ChargeVersion[] };
export function ChargeSettingsForm({
  tenancyId,
  onClose,
  onSaved,
}: {
  tenancyId: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t, locale } = useLocale();
  const [state, setState] = useState<Loaded>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  const [edit, setEdit] = useState<{ version?: ChargeVersion }>();
  const body = useRef<Handle>(null);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const db = await getDatabase();
        const [tenancy, versions] = await Promise.all([
          getBillingTenancy(db, tenancyId),
          listChargeVersions(db, tenancyId),
        ]);
        if (active)
          setState(
            tenancy && !tenancy.endedOn
              ? { status: 'ready', tenancy, versions }
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
  }, [tenancyId, attempt]);
  function back() {
    if (body.current) body.current.close();
    else onClose();
  }
  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={back}
    >
      {state.status === 'ready' && edit ? (
        <SettingsEditor
          ref={body}
          tenancy={state.tenancy}
          versions={state.versions}
          version={edit.version}
          onClose={() => setEdit(undefined)}
          onSaved={onSaved}
        />
      ) : (
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}>
          <ScrollView contentContainerStyle={{ padding: 20, gap: 20 }}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('back')}
              onPress={onClose}
              style={[
                surfaces.control,
                {
                  width: 48,
                  minHeight: 48,
                  alignItems: 'center',
                  justifyContent: 'center',
                },
              ]}
            >
              <AssetIcon name="back" />
            </Pressable>
            <AppText variant="title" accessibilityRole="header">
              {t('chargeSettings')}
            </AppText>
            {state.status === 'ready' ? (
              <>
                <RentalLocation
                  propertyName={state.tenancy.propertyName}
                  floorName={state.tenancy.floorName}
                  unitName={state.tenancy.unitName}
                />
                <AppText>{state.tenancy.tenantName}</AppText>
                <PrimaryButton
                  label={t('chargeAddVersion')}
                  onPress={() => setEdit({})}
                />
                <AppText variant="heading">{t('chargeHistory')}</AppText>
                {!state.versions.length && (
                  <AppText>{t('chargeNoneConfigured')}</AppText>
                )}
                {state.versions.map((version) => (
                  <View
                    key={version.id}
                    style={[surfaces.card, { padding: 20, gap: 16 }]}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        gap: 12,
                        alignItems: 'center',
                      }}
                    >
                      <AppText style={{ flex: 1 }}>
                        {t('chargeFrom', {
                          month: billMonth(version.effectiveMonth, locale),
                        })}
                      </AppText>
                      <EditButton
                        label={t('chargeEditVersion', {
                          month: billMonth(version.effectiveMonth, locale),
                        })}
                        onPress={() => setEdit({ version })}
                      />
                    </View>
                    <ChargeSummary settings={version.settings} />
                  </View>
                ))}
              </>
            ) : state.status === 'loading' ? (
              <ActivityIndicator color={colors.brand} />
            ) : (
              <>
                <AppText accessibilityRole="alert">
                  {t(
                    state.status === 'missing'
                      ? 'chargeMissing'
                      : 'chargeReadError',
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
          </ScrollView>
        </SafeAreaView>
      )}
    </Modal>
  );
}
function SettingsEditor({
  tenancy,
  versions,
  version,
  onClose,
  onSaved,
  ref,
}: {
  tenancy: BillingTenancy;
  versions: ChargeVersion[];
  version?: ChargeVersion;
  onClose: () => void;
  onSaved: () => void;
  ref: Ref<Handle>;
}) {
  const { t, locale } = useLocale();
  const [initial] = useState(() => {
    const month = version?.effectiveMonth ?? localDate().slice(0, 7);
    const prior = version ?? applicableCharges(versions, month);
    return {
      month,
      input: prior ? chargeInput(prior.settings) : emptyChargeInput(),
    };
  });
  const [month, setMonth] = useState(initial.month),
    [input, setInput] = useState(initial.input);
  const [error, setError] = useState<ChargeError>(),
    [failed, setFailed] = useState(false),
    [saving, setSaving] = useState(false);
  const inFlight = useRef(false),
    monthRef = useRef<TextInputInstance>(null);
  const dirty =
    month !== initial.month ||
    JSON.stringify(input) !== JSON.stringify(initial.input);
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
  async function save() {
    if (inFlight.current) return;
    const normalizedMonth = latinDigits(month);
    try {
      parseChargeSettings(input);
    } catch (caught) {
      if (caught instanceof ChargeError) setError(caught);
      return;
    }
    inFlight.current = true;
    setSaving(true);
    setFailed(false);
    setError(undefined);
    try {
      await saveChargeVersion(
        await getDatabase(),
        tenancy.id,
        normalizedMonth,
        input,
        version?.id,
      );
      onSaved();
    } catch (caught) {
      if (caught instanceof ChargeError) {
        setError(caught);
        if (!caught.field) monthRef.current?.focus();
      } else setFailed(true);
      inFlight.current = false;
      setSaving(false);
    }
  }
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ padding: 20, gap: 20 }}
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('back')}
            disabled={saving}
            onPress={close}
            style={[
              surfaces.control,
              {
                width: 48,
                minHeight: 48,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <AssetIcon name="back" />
          </Pressable>
          <AppText variant="title" accessibilityRole="header">
            {t('chargeSettings')}
          </AppText>
          <RentalLocation
            propertyName={tenancy.propertyName}
            floorName={tenancy.floorName}
            unitName={tenancy.unitName}
          />
          <AppText>{tenancy.tenantName}</AppText>
          <FormField
            inputRef={monthRef}
            label={t('chargeEffective')}
            value={month}
            placeholder={t('chargeEffectiveExample')}
            editable={!saving && !version}
            onChangeText={(value) => {
              setMonth(value);
              setError(undefined);
            }}
            error={
              error?.code === 'invalid' && !error.field
                ? t('chargeEffectiveError')
                : undefined
            }
          />
          {version && (
            <AppText variant="label" color={colors.muted}>
              {t('chargeEffectiveFixed')}
            </AppText>
          )}
          <ChargeFields
            input={input}
            onChange={(value) => {
              setInput(value);
              setError(undefined);
              setFailed(false);
            }}
            disabled={saving}
            error={error}
          />
          {error?.code === 'locked' && (
            <AppText accessibilityRole="alert" color={colors.error}>
              {t('chargeLocked', {
                month: error.month ? billMonth(error.month, locale) : month,
              })}
            </AppText>
          )}
          {error?.code === 'duplicate' && (
            <AppText accessibilityRole="alert" color={colors.error}>
              {t('chargeDuplicate')}
            </AppText>
          )}
          {error?.code === 'missing' && (
            <AppText accessibilityRole="alert" color={colors.error}>
              {t('chargeMissing')}
            </AppText>
          )}
        </ScrollView>
        <View style={{ padding: 20, gap: 12, backgroundColor: colors.surface }}>
          {failed && (
            <AppText accessibilityRole="alert" color={colors.error}>
              {t('chargeSaveError')}
            </AppText>
          )}
          <PrimaryButton
            label={t(saving ? 'savingHouse' : 'saveHouse')}
            busy={saving}
            onPress={save}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
