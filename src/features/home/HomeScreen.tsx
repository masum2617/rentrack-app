import { useRef, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
  useWindowDimensions,
  type ScrollViewInstance,
} from 'react-native';
import { useScrollToTop } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../../i18n/LocaleProvider';
import { LanguageSelector } from '../../i18n/LanguageSelector';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { ChoiceSheet } from '../../shared/ui/ChoiceSheet';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { AttentionList } from './AttentionList';
import { EmptyHome } from './EmptyHome';
import { FinancialSummary } from './FinancialSummary';
import { demoProperties, getDemoSummary, type DemoMonth } from './homeDemoData';

export function HomeScreen({ empty = false }: { empty?: boolean }) {
  const { t, number } = useLocale();
  const { width, fontScale } = useWindowDimensions();
  const compact = width >= 380 && fontScale <= 1.15;
  const [propertyId, setPropertyId] = useState('all');
  const [month, setMonth] = useState<DemoMonth>('october');
  const [picker, setPicker] = useState<'property' | 'month' | undefined>();
  const scroll = useRef<ScrollViewInstance>(null);
  useScrollToTop(scroll);
  const summary = getDemoSummary(propertyId, month);
  const propertyName =
    demoProperties.find((property) => property.id === propertyId)?.name ??
    t('allProperties');
  function unavailable() {
    Alert.alert(t('unavailable'), t('unavailableBody'), [{ text: t('okay') }]);
  }
  function selectMonth(value: string) {
    if (value === 'october' || value === 'september') setMonth(value);
  }
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.screen}>
      <View style={[styles.header, !compact && styles.headerStacked]}>
        <View style={[styles.identity, !compact && styles.stackedItem]}>
          <AppText accessibilityRole="header" variant="title">
            {t(empty ? 'getStarted' : 'overview')}
          </AppText>
          <AppText variant="meta" color={colors.muted}>
            {empty
              ? t('yourAccount')
              : t(summary.properties === 1 ? 'portfolioOne' : 'portfolio', {
                  properties: number(summary.properties),
                  units: number(summary.units),
                })}
          </AppText>
        </View>
        <LanguageSelector compact={compact} />
      </View>
      <ScrollView
        ref={scroll}
        style={styles.body}
        contentContainerStyle={styles.content}
      >
        {empty ? (
          <EmptyHome onAdd={unavailable} />
        ) : (
          <>
            <View
              style={[styles.selectors, !compact && styles.selectorStacked]}
            >
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${t('properties')}: ${propertyName}`}
                onPress={() => setPicker('property')}
                style={[
                  surfaces.control,
                  styles.selector,
                  !compact && styles.stackedItem,
                ]}
              >
                <AppText variant="label" style={styles.selectorLabel}>
                  {propertyName}
                </AppText>
                <AssetIcon name="down" />
              </Pressable>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`${t('billingMonth')}: ${t(month)}`}
                onPress={() => setPicker('month')}
                style={[
                  surfaces.control,
                  styles.selector,
                  !compact && styles.stackedItem,
                ]}
              >
                <AppText variant="label" style={styles.selectorLabel}>
                  {t(month)}
                </AppText>
                <AssetIcon name="down" />
              </Pressable>
            </View>
            <FinancialSummary
              outstanding={summary.outstanding}
              billed={summary.billed}
              received={summary.received}
            />
            <PrimaryButton label={t('recordMoney')} onPress={unavailable} />
            <View style={styles.occupancy}>
              <AppText variant="label" style={styles.occupancyText}>
                {t('occupied', { count: number(summary.occupied) })}
              </AppText>
              <AppText
                variant="label"
                color={colors.muted}
                style={styles.occupancyText}
              >
                {t('vacant', {
                  count: number(summary.units - summary.occupied),
                })}
              </AppText>
            </View>
            <AttentionList
              readings={summary.readings}
              drafts={summary.drafts}
              onPress={unavailable}
            />
            <AppText variant="meta" color={colors.muted}>
              {t('sampleNote')}
            </AppText>
          </>
        )}
      </ScrollView>
      <ChoiceSheet
        visible={picker === 'property'}
        title={t('properties')}
        selected={propertyId}
        onSelect={setPropertyId}
        onClose={() => setPicker(undefined)}
        choices={[
          { value: 'all', label: t('allProperties') },
          ...demoProperties.map((property) => ({
            value: property.id,
            label: property.name,
          })),
        ]}
      />
      <ChoiceSheet
        visible={picker === 'month'}
        title={t('billingMonth')}
        selected={month}
        onSelect={selectMonth}
        onClose={() => setPicker(undefined)}
        choices={[
          { value: 'october', label: t('october') },
          { value: 'september', label: t('september') },
        ]}
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 8,
  },
  headerStacked: {
    flexDirection: 'column',
    alignItems: 'stretch',
    gap: 12,
    paddingTop: 8,
    paddingBottom: 16,
  },
  identity: { flex: 1 },
  stackedItem: { flex: 0 },
  body: {
    flex: 1,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  content: { padding: 20, paddingTop: 16, paddingBottom: 44, gap: 16 },
  selectors: { flexDirection: 'row', gap: 12 },
  selectorStacked: { flexDirection: 'column' },
  selector: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minHeight: 48,
    padding: 12,
  },
  selectorLabel: { flex: 1 },
  occupancy: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: 36,
    gap: 12,
  },
  occupancyText: { flexShrink: 1 },
});
