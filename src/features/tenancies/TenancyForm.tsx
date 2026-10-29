import { useRef, useState } from 'react';
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
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
import { paisaInput } from '../../shared/money/paisa';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { fontFamilies } from '../../theme/typography';
import type { Tenant } from '../tenants/tenantStore';
import type { UnitContext } from '../properties/unitContext';
import { TenantChoice } from './TenantChoice';
import { TenancyFields } from './TenancyFields';
import { TenancyTerms } from './TenancyTerms';
import { ChargeFields } from './ChargeFields';
import { ChargeSummary } from './ChargeSummary';
import {
  emptyChargeInput,
  parseChargeSettings,
  ChargeError,
} from './chargeSettings';
import {
  createTenancy,
  correctTenancy,
  type CurrentTenancy,
} from './tenancyStore';
import {
  localDate,
  parsedTerms,
  TenancyError,
  validateTenancy,
  type TenancyErrors,
  type TenancyField,
  type TenancyInput,
} from './tenancyValidation';

type SelectedTenant = Pick<Tenant, 'id' | 'name' | 'phone' | 'address'>;
export function TenancyForm({
  context,
  tenancy,
  onClose,
  onSaved,
}: {
  context: UnitContext;
  tenancy?: CurrentTenancy;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [initial] = useState<TenancyInput>(() => ({
    startDate: tenancy?.startDate ?? localDate(),
    rent: tenancy ? paisaInput(tenancy.rentPaisa) : '',
    dueDay: tenancy ? String(tenancy.dueDay) : '',
    noticeMonths: tenancy ? String(tenancy.noticeMonths) : '',
    agreedAdvance: tenancy ? paisaInput(tenancy.agreedAdvancePaisa) : '',
  }));
  const [input, setInput] = useState(initial);
  const [charges, setCharges] = useState(emptyChargeInput);
  const [chargeError, setChargeError] = useState<ChargeError>();
  const [chargesOpen, setChargesOpen] = useState(false);
  const [selected, setSelected] = useState<SelectedTenant | undefined>(() =>
    tenancy
      ? {
          id: tenancy.tenantId,
          name: tenancy.tenantName,
          phone: tenancy.tenantPhone,
          address: '',
        }
      : undefined,
  );
  const [step, setStep] = useState<'choose' | 'terms' | 'review'>(
    tenancy ? 'terms' : 'choose',
  );
  const [errors, setErrors] = useState<TenancyErrors>({});
  const [focusRequest, setFocusRequest] = useState(0);
  const [failure, setFailure] = useState<
    'save' | 'occupied' | 'missing' | 'billed'
  >();
  const [saving, setSaving] = useState(false);
  const inFlight = useRef(false);
  const dirty =
    selected?.id !== tenancy?.tenantId ||
    JSON.stringify(charges) !== JSON.stringify(emptyChargeInput()) ||
    (
      ['startDate', 'rent', 'dueDay', 'noticeMonths', 'agreedAdvance'] as const
    ).some((field) => initial[field] !== input[field]);
  const review = parsedTerms(input);

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
    if (step === 'review') setStep('terms');
    else if (step === 'terms' && !tenancy) setStep('choose');
    else close();
  }
  function change(field: TenancyField, value: string) {
    setInput((old) => ({ ...old, [field]: value }));
    setErrors((old) => ({ ...old, [field]: undefined }));
    setFailure(undefined);
  }
  function next() {
    Keyboard.dismiss();
    if (step === 'choose') {
      if (selected) setStep('terms');
      return;
    }
    const nextErrors = validateTenancy(input);
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      setFocusRequest((value) => value + 1);
      return;
    }
    if (!tenancy) {
      try {
        parseChargeSettings(charges);
      } catch (error) {
        if (error instanceof ChargeError) {
          setChargesOpen(true);
          setChargeError(error);
        }
        return;
      }
    }
    setStep('review');
  }
  async function save() {
    if (inFlight.current || !selected) return;
    const nextErrors = validateTenancy(input);
    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setFocusRequest((value) => value + 1);
      setStep('terms');
      return;
    }
    inFlight.current = true;
    setSaving(true);
    setFailure(undefined);
    try {
      const db = await getDatabase();
      if (tenancy) await correctTenancy(db, context.unit.id, tenancy.id, input);
      else
        await createTenancy(db, context.unit.id, selected.id, input, charges);
    } catch (error) {
      inFlight.current = false;
      setSaving(false);
      if (error instanceof ChargeError) {
        setChargeError(error);
        setChargesOpen(true);
        setStep('terms');
      } else if (error instanceof TenancyError && error.reason === 'invalid') {
        setErrors(error.fields);
        setFocusRequest((value) => value + 1);
        setStep('terms');
      } else
        setFailure(
          error instanceof TenancyError && error.reason !== 'invalid'
            ? error.reason
            : 'save',
        );
      return;
    }
    onSaved();
  }
  return (
    <Modal
      visible
      presentationStyle="fullScreen"
      animationType="slide"
      onRequestClose={back}
    >
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
              onPress={back}
              style={[surfaces.control, styles.back]}
            >
              <AssetIcon name="back" />
            </Pressable>
            <Pressable
              accessibilityRole="button"
              disabled={saving}
              onPress={close}
              style={styles.close}
            >
              <AppText color={colors.brand}>{t('tenancyClose')}</AppText>
            </Pressable>
          </View>
          {step === 'choose' ? (
            <View style={styles.choice}>
              <AppText accessibilityRole="header" variant="title">
                {t('startTenancy')}
              </AppText>
              <AppText variant="label" color={colors.muted}>
                {t('tenancyChooseTenant')}
              </AppText>
              <TenantChoice
                selectedId={selected?.id}
                onSelect={(person) => {
                  setSelected(person);
                  setFailure(undefined);
                }}
              />
            </View>
          ) : (
            <ScrollView
              keyboardShouldPersistTaps="handled"
              keyboardDismissMode="on-drag"
              contentContainerStyle={styles.scroll}
            >
              <AppText accessibilityRole="header" variant="title">
                {t(
                  step === 'review'
                    ? 'tenancyReview'
                    : tenancy
                      ? 'correctTenancy'
                      : 'tenancyEnterTerms',
                )}
              </AppText>
              <View style={styles.context}>
                <AppText variant="label" color={colors.muted}>
                  {t('tenancySelectedUnit')}
                </AppText>
                <AppText
                  style={
                    /[\u0980-\u09ff]/.test(context.unit.name)
                      ? { fontFamily: fontFamilies.bn.medium }
                      : undefined
                  }
                >
                  {context.unit.name}
                </AppText>
                <AppText
                  variant="label"
                  color={colors.muted}
                  style={
                    /[\u0980-\u09ff]/.test(
                      context.property.name + context.floor.name,
                    )
                      ? { fontFamily: fontFamilies.bn.medium }
                      : undefined
                  }
                >
                  {context.property.name} · {context.floor.name}
                </AppText>
                <AppText variant="label" color={colors.muted}>
                  {context.property.location}
                </AppText>
                <AppText
                  variant="heading"
                  style={
                    selected && /[\u0980-\u09ff]/.test(selected.name)
                      ? { fontFamily: fontFamilies.bn.semibold }
                      : undefined
                  }
                >
                  {selected?.name}
                </AppText>
                {selected?.phone ? (
                  <AppText variant="label" color={colors.muted}>
                    {selected.phone}
                  </AppText>
                ) : undefined}
                {selected?.address ? (
                  <AppText variant="label" color={colors.muted}>
                    {selected.address}
                  </AppText>
                ) : undefined}
              </View>
              {step === 'terms' ? (
                <>
                  <TenancyFields
                    focusRequest={focusRequest}
                    input={input}
                    errors={errors}
                    editable={!saving}
                    onChange={change}
                  />
                  {!tenancy && (
                    <>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityState={{ expanded: chargesOpen }}
                        onPress={() => setChargesOpen((value) => !value)}
                        disabled={saving}
                        style={[
                          surfaces.control,
                          { minHeight: 52, padding: 12 },
                        ]}
                      >
                        <AppText color={colors.brand}>
                          {t('chargeOptional')}
                        </AppText>
                      </Pressable>
                      {chargesOpen && (
                        <ChargeFields
                          input={charges}
                          disabled={saving}
                          error={chargeError}
                          onChange={(value) => {
                            setCharges(value);
                            setChargeError(undefined);
                          }}
                        />
                      )}
                    </>
                  )}
                </>
              ) : (
                review && (
                  <>
                    <TenancyTerms terms={review} />
                    {!tenancy && (
                      <>
                        <AppText variant="heading">
                          {t('chargeOptional')}
                        </AppText>
                        <ChargeSummary
                          settings={parseChargeSettings(charges)}
                        />
                      </>
                    )}
                    <AppText color={colors.muted}>
                      {t('tenancyTermsOnly')}
                    </AppText>
                  </>
                )
              )}
            </ScrollView>
          )}
          <View style={styles.footer}>
            {failure && (
              <AppText accessibilityRole="alert" color={colors.error}>
                {t(
                  failure === 'billed'
                    ? 'billTermsLocked'
                    : failure === 'occupied'
                      ? 'tenancyOccupiedError'
                      : failure === 'missing'
                        ? 'tenancyMissingError'
                        : 'tenancySaveError',
                )}
              </AppText>
            )}
            {step === 'choose' && !selected && (
              <AppText variant="label" color={colors.muted}>
                {t('tenancySelectHint')}
              </AppText>
            )}
            <PrimaryButton
              label={t(
                saving
                  ? 'savingHouse'
                  : step === 'review'
                    ? 'saveHouse'
                    : 'tenancyNext',
              )}
              busy={saving}
              disabled={step === 'choose' && !selected}
              onPress={step === 'review' ? save : next}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  bar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 8,
  },
  back: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: { minHeight: 48, paddingHorizontal: 12, justifyContent: 'center' },
  choice: { flex: 1, padding: 20, gap: 16, backgroundColor: colors.surface },
  scroll: { padding: 20, gap: 24, backgroundColor: colors.surface },
  context: {
    padding: 20,
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.selected,
  },
  footer: {
    padding: 20,
    gap: 12,
    backgroundColor: colors.surface,
    boxShadow: [
      { offsetX: 0, offsetY: -3, blurRadius: 18, color: colors.softShadow },
    ],
  },
});
