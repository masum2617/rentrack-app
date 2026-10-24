import { Pressable, ScrollView, StyleSheet, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../theme/colors';
import { bangla, english } from './messages';

export function LocaleStartup({
  failed,
  onRetry,
}: {
  failed: boolean;
  onRetry: () => void;
}) {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="alert" style={styles.bangla}>
          {failed ? bangla.preferenceLoadError : bangla.preferenceLoading}
        </Text>
        <Text style={styles.english}>
          {failed ? english.preferenceLoadError : english.preferenceLoading}
        </Text>
        {failed && (
          <Pressable
            accessibilityRole="button"
            onPress={onRetry}
            style={styles.retry}
          >
            <Text style={[styles.bangla, styles.buttonText]}>
              {bangla.retry}
            </Text>
            <Text style={[styles.english, styles.buttonText]}>
              {english.retry}
            </Text>
          </Pressable>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.canvas },
  content: { flexGrow: 1, justifyContent: 'center', padding: 24, gap: 16 },
  bangla: {
    fontFamily: 'BengaliRegular',
    fontSize: 18,
    lineHeight: 28,
    color: colors.ink,
  },
  english: {
    fontFamily: 'EnglishRegular',
    fontSize: 18,
    lineHeight: 28,
    color: colors.ink,
  },
  retry: {
    minHeight: 56,
    padding: 16,
    gap: 8,
    borderRadius: 12,
    backgroundColor: colors.brand,
  },
  buttonText: { color: colors.surface, textAlign: 'center' },
});
