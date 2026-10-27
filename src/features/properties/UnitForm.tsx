import { useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, StyleSheet, View, type TextInputInstance } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../../i18n/LocaleProvider';
import { getDatabase } from '../../platform/database/database';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { PrimaryButton } from '../../shared/ui/PrimaryButton';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';
import { fontFamilies } from '../../theme/typography';
import { PropertyField } from './PropertyField';
import { UnitCountField } from './UnitCountField';
import type { Property } from './propertyStore';
import type { Floor } from './floorStore';
import { createUnit, updateUnit, type Unit } from './unitStore';
import { validateUnit, UnitValidationError, type UnitErrors, type UnitField, type UnitInput } from './unitValidation';

export function UnitForm({ property, floor, unit, onClose, onSaved }: {
  property: Property;
  floor: Floor;
  unit?: Unit;
  onClose: () => void;
  onSaved: () => void;
}) {
  const { t, locale } = useLocale();
  const [initial] = useState<UnitInput>(() => {
    function numeric(value: number) {
      return locale === 'bn' ? String(value).replace(/[0-9]/g, (digit) => '০১২৩৪৫৬৭৮৯'[Number(digit)]) : String(value);
    }
    return { name: unit?.name ?? '', sizeSqFt: unit?.sizeSqFt !== undefined ? numeric(unit.sizeSqFt) : '',
      bedrooms: numeric(unit?.bedrooms ?? 0), drawingRooms: numeric(unit?.drawingRooms ?? 0),
      totalBathrooms: numeric(unit?.totalBathrooms ?? 0), attachedBathrooms: numeric(unit?.attachedBathrooms ?? 0),
      balconies: numeric(unit?.balconies ?? 0), notes: unit?.notes ?? '' };
  });
  const [input, setInput] = useState(initial);
  const [errors, setErrors] = useState<UnitErrors>({});
  const [status, setStatus] = useState<'idle' | 'saving' | 'error'>('idle');
  const inFlight = useRef(false);
  const nameRef = useRef<TextInputInstance>(null), sizeRef = useRef<TextInputInstance>(null);
  const bedRef = useRef<TextInputInstance>(null), drawingRef = useRef<TextInputInstance>(null);
  const bathRef = useRef<TextInputInstance>(null), attachedRef = useRef<TextInputInstance>(null), balconyRef = useRef<TextInputInstance>(null);
  const fields: UnitField[] = ['name', 'sizeSqFt', 'bedrooms', 'drawingRooms', 'totalBathrooms', 'attachedBathrooms', 'balconies', 'notes'];
  const dirty = fields.some((field) => input[field] !== initial[field]);
  function requestClose() {
    if (inFlight.current) return;
    if (!dirty) { onClose(); return; }
    Alert.alert(t('unsavedHouse'), t('unsavedHouseBody'), [
      { text: t('keepEditing'), style: 'cancel' }, { text: t('discardChanges'), style: 'destructive', onPress: onClose },
    ]);
  }
  function change(field: UnitField, value: string) {
    setInput((old) => ({ ...old, [field]: value }));
    setErrors((old) => ({ ...old, [field]: undefined, ...(field === 'totalBathrooms' ? { attachedBathrooms: undefined } : {}) }));
    setStatus('idle');
  }
  function showErrors(next: UnitErrors) {
    setErrors(next);
    const refs = { name: nameRef, sizeSqFt: sizeRef, bedrooms: bedRef, drawingRooms: drawingRef, totalBathrooms: bathRef, attachedBathrooms: attachedRef, balconies: balconyRef };
    for (const field of ['name', 'sizeSqFt', 'bedrooms', 'drawingRooms', 'totalBathrooms', 'attachedBathrooms', 'balconies'] as const) {
      if (next[field]) { refs[field].current?.focus(); break; }
    }
  }
  function error(field: UnitField) {
    const reason = errors[field];
    if (!reason) return undefined;
    if (reason === 'required') return t('unitNameRequired');
    if (reason === 'duplicate') return t('unitNameDuplicate');
    if (reason === 'positiveSize') return t('unitSizeInvalid');
    return t(reason === 'wholeCount' ? 'unitCountInvalid' : 'attachedCountInvalid');
  }
  async function save() {
    if (inFlight.current) return;
    const next = validateUnit(input);
    if (Object.keys(next).length) { showErrors(next); return; }
    inFlight.current = true;
    setStatus('saving');
    try {
      const db = await getDatabase();
      if (unit) await updateUnit(db, floor.id, unit.id, input);
      else await createUnit(db, floor.id, input);
    } catch (e) {
      inFlight.current = false;
      if (e instanceof UnitValidationError) { setStatus('idle'); showErrors(e.fields); }
      else setStatus('error');
      return;
    }
    onSaved();
  }
  const editable = status !== 'saving';
  return <Modal visible animationType="slide" presentationStyle="fullScreen" onRequestClose={requestClose}>
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <View style={styles.backBar}><Pressable accessibilityRole="button" accessibilityLabel={t('back')} disabled={!editable} accessibilityState={{ disabled: !editable }} onPress={requestClose} style={[surfaces.control, styles.back]}><AssetIcon name="back" /></Pressable></View>
        <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled" keyboardDismissMode="on-drag">
          <View style={styles.header}><AppText accessibilityRole="header" variant="title">{t(unit ? 'editUnit' : 'newUnit')}</AppText><AppText variant="label" color={colors.muted}>{t('unitFormSubtitle')}</AppText></View>
          <View style={styles.body}>
            <View style={styles.parent}>
              <AppText variant="label" color={colors.muted}>{t('selectedFloor')}</AppText>
              <AppText variant="heading" style={/[\u0980-\u09ff]/.test(floor.name) ? { fontFamily: fontFamilies.bn.semibold } : undefined}>{floor.name}</AppText>
              <AppText variant="label" color={colors.muted} style={/[\u0980-\u09ff]/.test(property.name) ? { fontFamily: fontFamilies.bn.medium } : undefined}>{property.name}</AppText>
            </View>
            <PropertyField label={`${t('unitName')} *`} value={input.name} placeholder={t('unitNameExample')} inputRef={nameRef} editable={editable} error={error('name')} onChangeText={(v) => change('name', v)} onSubmitEditing={() => sizeRef.current?.focus()} />
            <PropertyField label={t('unitSize')} value={input.sizeSqFt} placeholder={t('unitSizeExample')} inputRef={sizeRef} editable={editable} error={error('sizeSqFt')} onChangeText={(v) => change('sizeSqFt', v)} keyboardType="decimal-pad" returnKeyType="done" />
            <AppText accessibilityRole="header" variant="heading">{t('unitLayout')}</AppText>
            <AppText variant="label" color={colors.muted}>{t('unitCountsHint')}</AppText>
            <UnitCountField label={t('bedrooms')} value={input.bedrooms} onChangeText={(v) => change('bedrooms', v)} editable={editable} error={error('bedrooms')} inputRef={bedRef} />
            <UnitCountField label={t('drawingRooms')} value={input.drawingRooms} onChangeText={(v) => change('drawingRooms', v)} editable={editable} error={error('drawingRooms')} inputRef={drawingRef} />
            <UnitCountField label={t('totalBathrooms')} value={input.totalBathrooms} onChangeText={(v) => change('totalBathrooms', v)} editable={editable} error={error('totalBathrooms')} inputRef={bathRef} />
            <UnitCountField label={t('attachedBathrooms')} value={input.attachedBathrooms} onChangeText={(v) => change('attachedBathrooms', v)} editable={editable} error={error('attachedBathrooms')} inputRef={attachedRef} />
            <AppText variant="label" color={colors.muted}>{t('attachedBathroomHint')}</AppText>
            <UnitCountField label={t('balconies')} value={input.balconies} onChangeText={(v) => change('balconies', v)} editable={editable} error={error('balconies')} inputRef={balconyRef} />
            <PropertyField label={t('unitNotes')} value={input.notes} placeholder={t('unitNotesExample')} editable={editable} onChangeText={(v) => change('notes', v)} multiline />
          </View>
        </ScrollView>
        <View style={styles.footer}>
          {status === 'error' && <AppText accessibilityRole="alert" variant="label" color={colors.error}>{t('unitSaveError')}</AppText>}
          <PrimaryButton label={t(status === 'saving' ? 'savingHouse' : 'saveHouse')} busy={!editable} onPress={save} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </Modal>;
}
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  backBar: { paddingHorizontal: 20, paddingVertical: 8 },
  back: { width: 48, minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  scroll: { flexGrow: 1 }, header: { paddingHorizontal: 20, paddingBottom: 20, gap: 8 },
  body: { flexGrow: 1, padding: 20, gap: 24, borderTopLeftRadius: 24, borderTopRightRadius: 24, backgroundColor: colors.surface },
  parent: { padding: 20, gap: 4, borderRadius: 12, backgroundColor: colors.selected },
  footer: { padding: 20, gap: 12, backgroundColor: colors.surface, boxShadow: [{ offsetX: 0, offsetY: -3, blurRadius: 18, color: colors.softShadow }] },
});
