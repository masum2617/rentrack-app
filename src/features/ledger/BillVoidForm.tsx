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
import type { MessageKey } from '../../i18n/messages';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { FormField } from '../../shared/ui/FormField';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { billError } from './billPresentation';
import { voidBill } from './billStore';

export function BillVoidForm({
  billId,
  onClose,
  onSaved,
}: {
  billId: number;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t } = useLocale();
  const [reason, setReason] = useState(''),
    [invalid, setInvalid] = useState(false),
    [failure, setFailure] = useState<MessageKey>();
  const [saving, setSaving] = useState(false);
  const input = useRef<TextInputInstance>(null),
    inFlight = useRef(false),
    confirming = useRef(false);
  function close() {
    if (inFlight.current) return;
    if (!reason) {
      onClose();
      return;
    }
    Alert.alert(t('unsavedHouse'), t('unsavedHouseBody'), [
      { text: t('keepEditing'), style: 'cancel' },
      { text: t('discardChanges'), style: 'destructive', onPress: onClose },
    ]);
  }
  async function save() {
    if (inFlight.current) return;
    inFlight.current = true;
    setSaving(true);
    setFailure(undefined);
    try {
      await voidBill(await getDatabase(), billId, reason);
      onSaved();
    } catch (error) {
      inFlight.current = false;
      setSaving(false);
      setFailure(billError(error));
    }
  }
  function confirm() {
    if (!reason.trim()) {
      setInvalid(true);
      input.current?.focus();
      return;
    }
    if (inFlight.current || confirming.current) return;
    confirming.current = true;
    Alert.alert(
      t('billVoidConfirm'),
      t('billVoidBody'),
      [
        {
          text: t('billCancel'),
          style: 'cancel',
          onPress: () => {
            confirming.current = false;
          },
        },
        {
          text: t('billVoid'),
          style: 'destructive',
          onPress: () => {
            confirming.current = false;
            void save();
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
    <Modal
      visible
      presentationStyle="fullScreen"
      animationType="slide"
      onRequestClose={close}
    >
      <SafeAreaView style={styles.screen}>
        <KeyboardAvoidingView
          style={styles.screen}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            contentContainerStyle={styles.body}
          >
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={t('back')}
              disabled={saving}
              onPress={close}
              style={styles.back}
            >
              <AssetIcon name="back" />
            </Pressable>
            <AppText variant="title" accessibilityRole="header">
              {t('billVoid')}
            </AppText>
            <FormField
              label={t('billVoidReason')}
              value={reason}
              placeholder={t('billVoidReason')}
              editable={!saving}
              multiline
              inputRef={input}
              error={invalid ? t('billReasonError') : undefined}
              onChangeText={(value) => {
                setReason(value);
                setInvalid(false);
              }}
            />
          </ScrollView>
          <View style={styles.body}>
            {failure && (
              <AppText accessibilityRole="alert" color={colors.error}>
                {t(failure)}
              </AppText>
            )}
            <PrimaryButton
              label={t(saving ? 'savingHouse' : 'billVoid')}
              busy={saving}
              onPress={confirm}
            />
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  body: { padding: 20, gap: 20 },
  back: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
