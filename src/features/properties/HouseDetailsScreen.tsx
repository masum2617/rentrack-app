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
import { getProperty, type Property } from './propertyStore';
import {
  listFloorSummaries,
  type Floor,
  type FloorSummary,
} from './floorStore';
import { PropertyRow } from './PropertyRow';
import { FloorRow } from './FloorRow';

import {
  listActiveRentals,
  type ActiveRental,
} from '../tenancies/tenancyStore';

type State =
  | { status: 'loading' | 'error' | 'missing' }
  | {
      status: 'ready';
      property: Property;
      floors: FloorSummary[];
      rentals: ActiveRental[];
    };
export function HouseDetailsScreen({
  propertyId,
  revision,
  notice,
  onBack,
  onEditHouse,
  onAddFloor,
  onEditFloor,
  onOpenFloor,
}: {
  propertyId: number;
  revision: number;
  notice?: MessageKey;
  onBack: () => void;
  onEditHouse: (property: Property) => void;
  onAddFloor: (property: Property) => void;
  onEditFloor: (property: Property, floor: Floor) => void;
  onOpenFloor: (floorId: number) => void;
}) {
  const { t } = useLocale();
  const { width, fontScale } = useWindowDimensions();
  const stacked = width < 360 || fontScale > 1.3;
  const [state, setState] = useState<State>({ status: 'loading' });
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let active = true;
    async function load() {
      try {
        const db = await getDatabase();
        const [property, floors, rentals] = await Promise.all([
          getProperty(db, propertyId),
          listFloorSummaries(db, propertyId),
          listActiveRentals(db, { propertyId }),
        ]);
        if (active)
          setState(
            property
              ? { status: 'ready', property, floors, rentals }
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
  }, [propertyId, revision, attempt]);
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
            accessibilityLabel={t('allHouses')}
            onPress={onBack}
            style={[surfaces.control, styles.back]}
          >
            <AssetIcon name="back" />
          </Pressable>
          <AppText
            accessibilityRole="header"
            variant="title"
            style={styles.title}
          >
            {t('houseDetails')}
          </AppText>
        </View>
        <AppText variant="label" color={colors.muted}>
          {t('houseFloorsSubtitle')}
        </AppText>
      </View>
      {state.status === 'ready' ? (
        <FlatList
          style={styles.body}
          contentContainerStyle={styles.content}
          data={state.floors}
          keyExtractor={(floor) => String(floor.id)}
          renderItem={({ item }) => (
            <FloorRow
              floor={item}
              rentals={state.rentals.filter(
                (rental) => rental.floorId === item.id,
              )}
              onEdit={(floor) => onEditFloor(state.property, floor)}
              onOpen={() => onOpenFloor(item.id)}
            />
          )}
          ListHeaderComponent={
            <View style={styles.contentHeader}>
              <PropertyRow property={state.property} onEdit={onEditHouse} />
              {notice && (
                <AppText
                  variant="label"
                  color={colors.brand}
                  accessibilityLiveRegion="polite"
                >
                  {t(notice)}
                </AppText>
              )}
              <View style={[styles.section, stacked && styles.stacked]}>
                <AppText
                  accessibilityRole="header"
                  variant="heading"
                  style={styles.title}
                >
                  {t('floorList')}
                </AppText>
                <View style={!stacked && styles.add}>
                  <PrimaryButton
                    label={t('addFloor')}
                    onPress={() => onAddFloor(state.property)}
                  />
                </View>
              </View>
            </View>
          }
          ListEmptyComponent={
            <View style={[surfaces.card, styles.empty]}>
              <AppText variant="heading">{t('noFloors')}</AppText>
              <AppText color={colors.muted}>{t('noFloorsBody')}</AppText>
            </View>
          }
        />
      ) : (
        <View style={[styles.body, styles.content, styles.state]}>
          {state.status === 'loading' ? (
            <>
              <ActivityIndicator color={colors.brand} />
              <AppText>{t('floorsLoading')}</AppText>
            </>
          ) : (
            <>
              <AppText accessibilityRole="alert" variant="heading">
                {t(
                  state.status === 'missing'
                    ? 'houseMissing'
                    : 'floorsLoadError',
                )}
              </AppText>
              <AppText color={colors.muted}>
                {t(
                  state.status === 'missing'
                    ? 'houseMissingBody'
                    : 'housesLoadErrorBody',
                )}
              </AppText>
              <PrimaryButton
                label={t(state.status === 'missing' ? 'allHouses' : 'retry')}
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
  title: { flex: 1 },
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
  section: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stacked: { flexDirection: 'column', alignItems: 'stretch' },
  add: { width: 180 },
  empty: { gap: 12, backgroundColor: colors.canvas, padding: 20 },
  state: { gap: 16 },
});
