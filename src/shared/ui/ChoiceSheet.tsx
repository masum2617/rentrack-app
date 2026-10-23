import { Modal, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { AppText } from './AppText';
import { AssetIcon } from './AssetIcon';
import { useLocale } from '../../i18n/LocaleProvider';
import { colors } from '../../theme/colors';

export type Choice = { value: string; label: string };
type Props = {
  visible: boolean;
  title: string;
  choices: Choice[];
  selected: string;
  onSelect: (value: string) => void;
  onClose: () => void;
};
export function ChoiceSheet({
  visible,
  title,
  choices,
  selected,
  onSelect,
  onClose,
}: Props) {
  const { t } = useLocale();
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.backdrop}>
        <View
          accessibilityViewIsModal
          onAccessibilityEscape={onClose}
          style={[styles.sheet, { paddingBottom: Math.max(insets.bottom, 20) }]}
        >
          <AppText accessibilityRole="header" variant="heading">
            {title}
          </AppText>
          <ScrollView>
            {choices.map((choice) => (
              <Pressable
                key={choice.value}
                accessibilityRole="radio"
                accessibilityState={{ checked: selected === choice.value }}
                onPress={() => {
                  onSelect(choice.value);
                  onClose();
                }}
                style={styles.choice}
              >
                <AppText style={styles.label}>{choice.label}</AppText>
                {selected === choice.value ? (
                  <AssetIcon name="radio" />
                ) : (
                  <View style={styles.radio} />
                )}
              </Pressable>
            ))}
          </ScrollView>
          <Pressable
            accessibilityRole="button"
            onPress={onClose}
            style={styles.close}
          >
            <AppText variant="label" color={colors.brand}>
              {t('close')}
            </AppText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: colors.overlay,
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    gap: 16,
    maxHeight: '80%',
  },
  choice: {
    minHeight: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderColor: colors.line,
  },
  label: { flex: 1 },
  close: { minHeight: 48, alignItems: 'center', justifyContent: 'center' },
  radio: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.muted,
  },
});
