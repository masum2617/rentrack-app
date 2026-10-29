import { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Pressable,
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
import { readTenantEditor, type TenantSummary } from './tenantReadModel';
import { TenantFormBody, type TenantFormHandle } from './TenantFormBody';

type State =
  | { status: 'loading' | 'error' | 'missing' }
  | { status: 'ready'; tenant?: TenantSummary };
export function TenantForm({
  tenantId,
  selectedUnitId,
  onClose,
  onSaved,
}: {
  tenantId?: number;
  selectedUnitId?: number;
  onClose: () => void;
  onSaved: (tenantId: number) => void;
}) {
  const { t } = useLocale();
  const form = useRef<TenantFormHandle>(null);
  const [state, setState] = useState<State>(() =>
    tenantId === undefined ? { status: 'ready' } : { status: 'loading' },
  );
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (tenantId === undefined) return;
    let active = true;
    const id = tenantId;
    async function load() {
      try {
        const tenant = await readTenantEditor(await getDatabase(), id);
        if (active)
          setState(
            tenant ? { status: 'ready', tenant } : { status: 'missing' },
          );
      } catch {
        if (active) setState({ status: 'error' });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [tenantId, attempt]);
  return (
    <Modal
      visible
      presentationStyle="fullScreen"
      animationType="slide"
      onRequestClose={() => {
        if (form.current) form.current.requestClose();
        else onClose();
      }}
    >
      {state.status === 'ready' ? (
        <TenantFormBody
          ref={form}
          tenant={state.tenant}
          rentals={state.tenant?.rentals ?? []}
          selectedUnitId={selectedUnitId}
          onClose={onClose}
          onSaved={onSaved}
        />
      ) : (
        <SafeAreaView style={styles.screen}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('back')}
            onPress={onClose}
            style={[surfaces.control, styles.back]}
          >
            <AssetIcon name="back" />
          </Pressable>
          <View style={styles.state}>
            {state.status === 'loading' ? (
              <>
                <ActivityIndicator color={colors.brand} />
                <AppText>{t('tenantEditorLoading')}</AppText>
              </>
            ) : (
              <>
                <AppText accessibilityRole="alert">
                  {t(
                    state.status === 'missing'
                      ? 'tenantMissing'
                      : 'tenantEditorError',
                  )}
                </AppText>
                <PrimaryButton
                  label={t(state.status === 'missing' ? 'back' : 'retry')}
                  onPress={
                    state.status === 'missing'
                      ? onClose
                      : () => {
                          setState({ status: 'loading' });
                          setAttempt((value) => value + 1);
                        }
                  }
                />
              </>
            )}
          </View>
        </SafeAreaView>
      )}
    </Modal>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, padding: 20, backgroundColor: colors.canvas, gap: 24 },
  back: {
    width: 48,
    minHeight: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  state: { gap: 20 },
});
