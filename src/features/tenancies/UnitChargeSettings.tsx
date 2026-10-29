import { useEffect, useState } from 'react';
import { ActivityIndicator, AppState, View } from 'react-native';
import { useLocale } from '../../i18n/LocaleProvider';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { EditButton } from '../../shared/ui/EditButton';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import {
  applicableCharges,
  listChargeVersions,
  type ChargeVersion,
} from './chargeSettings';
import { ChargeSettingsForm } from './ChargeSettingsForm';
import { ChargeSummary } from './ChargeSummary';
import { localDate } from './tenancyValidation';
import { billMonth } from '../ledger/billPresentation';

export function UnitChargeSettings({
  tenancyId,
  revision,
}: {
  tenancyId: number;
  revision: number;
}) {
  const { t, locale } = useLocale();
  const [state, setState] = useState<
    | { status: 'loading' }
    | { status: 'error' }
    | { status: 'ready'; versions: ChargeVersion[] }
  >({ status: 'loading' });
  const [attempt, setAttempt] = useState(0),
    [open, setOpen] = useState(false),
    [saved, setSaved] = useState(false);
  useEffect(() => {
    const listener = AppState.addEventListener('change', (status) => {
      if (status === 'active') setAttempt((n) => n + 1);
    });
    return () => listener.remove();
  }, []);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const versions = await listChargeVersions(
          await getDatabase(),
          tenancyId,
        );
        if (active) setState({ status: 'ready', versions });
      } catch {
        if (active) setState({ status: 'error' });
      }
    }
    void load();
    return () => {
      active = false;
    };
  }, [tenancyId, revision, attempt]);
  const month = localDate().slice(0, 7);
  return (
    <View style={{ gap: 16 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
        <AppText variant="heading" style={{ flex: 1 }}>
          {t('chargeCurrent')}
        </AppText>
        <EditButton label={t('chargeEdit')} onPress={() => setOpen(true)} />
      </View>
      {state.status === 'loading' ? (
        <ActivityIndicator color={colors.brand} />
      ) : state.status === 'error' ? (
        <>
          <AppText accessibilityRole="alert">{t('chargeReadError')}</AppText>
          <PrimaryButton
            label={t('retry')}
            onPress={() => setAttempt((n) => n + 1)}
          />
        </>
      ) : (
        <>
          <ChargeSummary
            settings={applicableCharges(state.versions, month)?.settings}
          />
          {state.versions
            .filter((version) => version.effectiveMonth > month)
            .map((version) => (
              <AppText key={version.id} color={colors.muted}>
                {t('chargeFrom', {
                  month: billMonth(version.effectiveMonth, locale),
                })}
              </AppText>
            ))}
        </>
      )}
      {saved && (
        <AppText accessibilityLiveRegion="polite" color={colors.brand}>
          {t('chargeSaved')}
        </AppText>
      )}
      {open && (
        <ChargeSettingsForm
          tenancyId={tenancyId}
          onClose={() => setOpen(false)}
          onSaved={() => {
            setOpen(false);
            setSaved(true);
            setAttempt((n) => n + 1);
          }}
        />
      )}
    </View>
  );
}
