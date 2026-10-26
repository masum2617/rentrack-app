import { useRef, useState } from 'react';
import {
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
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { PropertyField } from './PropertyField';
import {
  createProperty,
  updateProperty,
  validateProperty,
  type Property,
  type PropertyErrors,
  type PropertyInput,
} from './propertyStore';

export function PropertyForm({
  property,
  onClose,
  onSaved,
}: {
  property?: Property;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [initial] = useState<PropertyInput>(() => ({
    name: property?.name ?? '',
    location: property?.location ?? '',
    address: property?.address ?? '',
  }));
  const [input, setInput] = useState(initial);
  const [errors, setErrors] = useState<PropertyErrors>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const inFlight = useRef(false);
  const nameRef = useRef<TextInputInstance>(null);
  const locationRef = useRef<TextInputInstance>(null);
  const addressRef = useRef<TextInputInstance>(null);
  const dirty =
    input.name !== initial.name ||
    input.location !== initial.location ||
    input.address !== initial.address;

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

  function change(field: keyof PropertyInput, value: string) {
    setInput((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
    setStatus('idle');
  }

  async function save() {
    if (inFlight.current) return;
    const validation = validateProperty(input);
    setErrors(validation);
    if (validation.name || validation.location) {
      (validation.name ? nameRef : locationRef).current?.focus();
      return;
    }
    inFlight.current = true;
    setStatus('saving');
    try {
      const db = await getDatabase();
      if (property) await updateProperty(db, property.id, input);
      else await createProperty(db, input);
    } catch {
      setStatus('error');
      inFlight.current = false;
      return;
    }
    // Only close after the SQLite statement has completed successfully.
    onSaved();
  }

  return (
    <Modal
      visible
      animationType="slide"
      presentationStyle="fullScreen"
      onRequestClose={requestClose}
    >
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
                {t(property ? 'editHouse' : 'newHouse')}
              </AppText>
              <AppText variant="label" color={colors.muted}>
                {t('houseFormSubtitle')}
              </AppText>
            </View>
            <View style={styles.body}>
              <AppText variant="label" color={colors.muted}>
                {t('houseRequiredHint')}
              </AppText>
              <PropertyField
                label={`${t('houseName')} *`}
                value={input.name}
                placeholder={t('houseNameExample')}
                onChangeText={(value) => change('name', value)}
                inputRef={nameRef}
                editable={status !== 'saving'}
                error={errors.name ? t('houseNameRequired') : undefined}
                onSubmitEditing={() => locationRef.current?.focus()}
              />
              <PropertyField
                label={`${t('houseLocation')} *`}
                value={input.location}
                placeholder={t('houseLocationExample')}
                onChangeText={(value) => change('location', value)}
                inputRef={locationRef}
                editable={status !== 'saving'}
                error={errors.location ? t('houseLocationRequired') : undefined}
                onSubmitEditing={() => addressRef.current?.focus()}
              />
              <PropertyField
                label={t('houseAddress')}
                value={input.address}
                placeholder={t('houseAddressExample')}
                onChangeText={(value) => change('address', value)}
                inputRef={addressRef}
                editable={status !== 'saving'}
                multiline
              />
            </View>
          </ScrollView>
          <View style={styles.footer}>
            {status === 'error' && (
              <AppText
                variant="label"
                color={colors.error}
                accessibilityRole="alert"
              >
                {t('houseSaveError')}
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
    </Modal>
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
