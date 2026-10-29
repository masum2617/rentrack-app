import { EditButton } from '../../shared/ui/EditButton';
import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  View,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../../i18n/LocaleProvider';
import type { MessageKey } from '../../i18n/messages';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { fontFamilies } from '../../theme/typography';
import { getProperty, type Property } from './propertyStore';
import { getFloor, type Floor } from './floorStore';
import { listUnits, type Unit } from './unitStore';
import {
  listFloorOccupancy,
  type UnitOccupancy,
} from '../tenancies/tenancyStore';
import { UnitRow } from './UnitRow';

type State =
  | { status: 'loading' | 'error' | 'missing' }
  | {
      status: 'ready';
      property: Property;
      floor: Floor;
      units: Unit[];
      occupancy: UnitOccupancy[];
    };
export function FloorDetailsScreen({
  propertyId,
  floorId,
  revision,
  notice,
  onBack,
  onEditFloor,
  onAddUnit,
  onEditUnit,
  onOpenUnit,
  onOpenTenant,
}: {
  propertyId: number;
  floorId: number;
  revision: number;
  notice?: MessageKey;
  onOpenUnit: (unitId: number) => void;
  onOpenTenant: (tenantId: number, unitId: number) => void;
  onBack: () => void;
  onEditFloor: (property: Property, floor: Floor) => void;
  onAddUnit: (property: Property, floor: Floor) => void;
  onEditUnit: (property: Property, floor: Floor, unit: Unit) => void;
}) {
  const { t, number } = useLocale();
  const { width, fontScale } = useWindowDimensions();
  const stacked = width < 360 || fontScale > 1.3;
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const db = await getDatabase();
        const [property, floor, units, occupancy] = await Promise.all([
          getProperty(db, propertyId),
          getFloor(db, propertyId, floorId),
          listUnits(db, floorId),
          listFloorOccupancy(db, floorId),
        ]);
        if (active)
          setState(
            property && floor
              ? { status: 'ready', property, floor, units, occupancy }
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
  }, [propertyId, floorId, revision, attempt]);
  function retry() {
    setState({ status: 'loading' });
    setAttempt((value) => value + 1);
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={styles.header}>
        <View style={styles.heading}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('backToHouse')}
            onPress={onBack}
            style={[surfaces.control, styles.back]}
          >
            <AssetIcon name="back" />
          </Pressable>
          <AppText
            accessibilityRole="header"
            variant="title"
            style={styles.grow}
          >
            {t('floorDetails')}
          </AppText>
        </View>
        <AppText variant="label" color={colors.muted}>
          {t('floorUnitsSubtitle')}
        </AppText>
      </View>
      {state.status === 'ready' ? (
        <FlatList
          style={styles.body}
          contentContainerStyle={styles.content}
          data={state.units}
          keyExtractor={(unit) => String(unit.id)}
          renderItem={({ item }) => (
            <UnitRow
              unit={item}
              onOpen={() => onOpenUnit(item.id)}
              showOccupancy
              onOpenTenant={(tenantId) => onOpenTenant(tenantId, item.id)}
              occupant={state.occupancy.find(
                (entry) => entry.unitId === item.id,
              )}
              onEdit={(unit) => onEditUnit(state.property, state.floor, unit)}
            />
          )}
          ListHeaderComponent={
            <View style={styles.contentHeader}>
              <View style={[surfaces.card, styles.identity]}>
                <AppText
                  variant="label"
                  color={colors.muted}
                  style={
                    /[\u0980-\u09ff]/.test(state.property.name)
                      ? { fontFamily: fontFamilies.bn.medium }
                      : undefined
                  }
                >
                  {state.property.name}
                </AppText>
                <View style={styles.heading}>
                  <AppText
                    variant="heading"
                    style={[
                      styles.grow,
                      /[\u0980-\u09ff]/.test(state.floor.name) && {
                        fontFamily: fontFamilies.bn.semibold,
                      },
                    ]}
                  >
                    {state.floor.name}
                  </AppText>
                  <EditButton
                    label={t('editNamedFloor', { name: state.floor.name })}
                    onPress={() => onEditFloor(state.property, state.floor)}
                  />
                </View>
                {state.floor.floorCodeName ? (
                  <AppText variant="label" color={colors.muted}>
                    {t('floorCode')}: {state.floor.floorCodeName}
                  </AppText>
                ) : undefined}
                <AppText variant="label" color={colors.brand}>
                  {t(state.units.length === 1 ? 'unitCountOne' : 'unitCount', {
                    count: number(state.units.length),
                  })}
                </AppText>
              </View>
              {notice && (
                <AppText
                  variant="label"
                  color={colors.brand}
                  accessibilityLiveRegion="polite"
                >
                  {t(notice)}
                </AppText>
              )}
              <View style={[styles.heading, stacked && styles.stacked]}>
                <AppText
                  accessibilityRole="header"
                  variant="heading"
                  style={!stacked && styles.grow}
                >
                  {t('unitList')}
                </AppText>
                <View style={!stacked && styles.add}>
                  <PrimaryButton
                    label={t('addUnit')}
                    onPress={() => onAddUnit(state.property, state.floor)}
                  />
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={[surfaces.card, styles.empty]}>
              <AppText variant="heading">{t('noUnits')}</AppText>
              <AppText color={colors.muted}>{t('noUnitsBody')}</AppText>
            </View>
          }
        />
      ) : (
        <View style={[styles.body, styles.content]}>
          {state.status === 'loading' ? (
            <>
              <ActivityIndicator color={colors.brand} />
              <AppText>{t('unitsLoading')}</AppText>
            </>
          ) : (
            <>
              <AppText accessibilityRole="alert" variant="heading">
                {t(
                  state.status === 'missing'
                    ? 'floorMissing'
                    : 'unitsLoadError',
                )}
              </AppText>
              <AppText color={colors.muted}>
                {t(
                  state.status === 'missing'
                    ? 'floorMissingBody'
                    : 'housesLoadErrorBody',
                )}
              </AppText>
              <PrimaryButton
                label={t(state.status === 'missing' ? 'backToHouse' : 'retry')}
                onPress={state.status === 'missing' ? onBack : retry}
              />
            </>
          )}
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  header: { padding: 20, paddingTop: 8, gap: 8 },
  heading: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stacked: { flexDirection: 'column', alignItems: 'stretch' },
  grow: { flex: 1 },
  back: {
    width: 48,
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  body: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: { padding: 20, paddingBottom: 44, gap: 16 },
  contentHeader: { gap: 20 },
  identity: { padding: 20, gap: 12 },
  add: { width: 180 },
  empty: { backgroundColor: colors.canvas, padding: 20, gap: 12 },
});
