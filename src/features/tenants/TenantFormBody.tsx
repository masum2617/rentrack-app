import { useRef, useState, useImperativeHandle, type Ref } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  type TextInputInstance,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../../i18n/LocaleProvider';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { FormField } from '../../shared/ui/FormField';
import {
  createTenant,
  updateTenant,
  validateTenant,
  type Tenant,
  type TenantInput,
} from './tenantStore';

import { TenantTenancies } from './TenantTenancies';
import type { ActiveRental } from '../tenancies/tenancyStore';
export type TenantFormHandle = { requestClose: () => void };

export function TenantFormBody({
  tenant,
  rentals,
  selectedUnitId,
  ref,
  onClose,
  onSaved,
}: {
  tenant?: Tenant;
  rentals: ActiveRental[];
  selectedUnitId?: number;
  ref: Ref<TenantFormHandle>;
  onClose: () => void;
  onSaved: (tenantId: number) => void;
}) {
  const { t } = useLocale();
  const [initial] = useState<TenantInput>(() => ({
    name: tenant?.name ?? '',
    phone: tenant?.phone ?? '',
    idType: tenant?.idType ?? '',
    idNumber: tenant?.idNumber ?? '',
    emergencyContact: tenant?.emergencyContact ?? '',
    notes: tenant?.notes ?? '',
    address: tenant?.address ?? '',
  }));
  const [input, setInput] = useState(initial);
  const [nameError, setNameError] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(
    Boolean(
      tenant?.idType ||
        tenant?.idNumber ||
        tenant?.emergencyContact ||
        tenant?.notes,
    ),
  );
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const inFlight = useRef(false);
  const nameRef = useRef<TextInputInstance>(null);
  const phoneRef = useRef<TextInputInstance>(null);
  const addressRef = useRef<TextInputInstance>(null);
  const dirty = (
    [
      'name',
      'phone',
      'address',
      'idType',
      'idNumber',
      'emergencyContact',
      'notes',
    ] as const
  ).some((field) => input[field] !== initial[field]);

  function requestClose() {
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

  useImperativeHandle(ref, () => ({ requestClose }));

  function change(field: keyof TenantInput, value: string) {
    setInput((current) => ({ ...current, [field]: value }));
    if (field === 'name') setNameError(false);
    setStatus('idle');
  }

  async function save() {
    if (inFlight.current) return;
    if (!validateTenant(input)) {
      setNameError(true);
      nameRef.current?.focus();
      return;
    }
    setNameError(false);
    inFlight.current = true;
    setStatus('saving');
    let savedId: number;
    try {
      const db = await getDatabase();
      if (tenant) {
        await updateTenant(db, tenant.id, input);
        savedId = tenant.id;
      } else savedId = await createTenant(db, input);
    } catch {
      setStatus('error');
      inFlight.current = false;
      return;
    }
    // Only close after the SQLite statement has completed successfully.
    onSaved(savedId);
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        style={styles.screen}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.backBar}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('back')}
            accessibilityState={{ disabled: status === 'saving' }}
            disabled={status === 'saving'}
            onPress={requestClose}
            style={[surfaces.control, styles.back]}
          >
            <AssetIcon name="back" />
          </Pressable>
        </View>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <View style={styles.header}>
            <AppText accessibilityRole="header" variant="title">
              {t(tenant ? 'editTenant' : 'newTenant')}
            </AppText>
            <AppText variant="label" color={colors.muted}>
              {t('tenantFormSubtitle')}
            </AppText>
          </View>
          <View style={styles.body}>
            {tenant && (
              <TenantTenancies
                rentals={rentals}
                selectedUnitId={selectedUnitId}
              />
            )}
            <AppText variant="label" color={colors.muted}>
              {t('tenantRequiredHint')}
            </AppText>
            <FormField
              label={`${t('tenantName')} *`}
              value={input.name}
              placeholder={t('tenantNameExample')}
              onChangeText={(value) => change('name', value)}
              inputRef={nameRef}
              editable={status !== 'saving'}
              error={nameError ? t('tenantNameRequired') : undefined}
              onSubmitEditing={() => phoneRef.current?.focus()}
            />
            <FormField
              label={t('tenantPhone')}
              value={input.phone}
              placeholder={t('tenantPhoneExample')}
              onChangeText={(value) => change('phone', value)}
              keyboardType="phone-pad"
              inputRef={phoneRef}
              editable={status !== 'saving'}
              onSubmitEditing={() => addressRef.current?.focus()}
            />
            <FormField
              label={t('tenantAddress')}
              value={input.address}
              placeholder={t('tenantAddressExample')}
              onChangeText={(value) => change('address', value)}
              inputRef={addressRef}
              editable={status !== 'saving'}
              multiline
            />
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ expanded: detailsOpen }}
              onPress={() => setDetailsOpen((value) => !value)}
              style={styles.detailsToggle}
            >
              <AppText color={colors.brand}>
                {t(detailsOpen ? 'hideTenantDetails' : 'moreTenantDetails')}
              </AppText>
            </Pressable>
            {detailsOpen && (
              <>
                <FormField
                  label={t('tenantIdType')}
                  value={input.idType}
                  placeholder={t('tenantIdTypeExample')}
                  editable={status !== 'saving'}
                  onChangeText={(v) => change('idType', v)}
                  returnKeyType="done"
                />
                <FormField
                  label={t('tenantIdNumber')}
                  value={input.idNumber}
                  placeholder={t('tenantIdNumberExample')}
                  editable={status !== 'saving'}
                  onChangeText={(v) => change('idNumber', v)}
                  returnKeyType="done"
                />
                <FormField
                  label={t('tenantEmergency')}
                  value={input.emergencyContact}
                  placeholder={t('tenantEmergencyExample')}
                  editable={status !== 'saving'}
                  onChangeText={(v) => change('emergencyContact', v)}
                  returnKeyType="done"
                />
                <FormField
                  label={t('tenantNotes')}
                  value={input.notes}
                  placeholder={t('tenantNotesExample')}
                  editable={status !== 'saving'}
                  onChangeText={(v) => change('notes', v)}
                  multiline
                />
              </>
            )}
          </View>
        </ScrollView>
        <View style={styles.footer}>
          {status === 'error' && (
            <AppText
              variant="label"
              color={colors.error}
              accessibilityRole="alert"
            >
              {t('tenantSaveError')}
            </AppText>
          )}
          <PrimaryButton
            label={t(status === 'saving' ? 'savingHouse' : 'saveHouse')}
            busy={status === 'saving'}
            onPress={save}
          />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  backBar: { paddingHorizontal: 20, paddingVertical: 8 },
  header: { paddingHorizontal: 20, paddingBottom: 20, gap: 8 },
  scrollContent: { flexGrow: 1 },
  back: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsToggle: { minHeight: 52, justifyContent: 'center' },
  body: {
    flexGrow: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 24,
    paddingBottom: 32,
  },
  footer: {
    backgroundColor: colors.surface,
    padding: 20,
    gap: 12,
    boxShadow: [
      { offsetX: 0, offsetY: -3, blurRadius: 18, color: colors.softShadow },
    ],
  },
});
