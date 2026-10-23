import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '../../theme/colors';

export function HomeScreen() {
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text accessibilityRole="header" style={styles.title}>
          হোম
        </Text>
        <View style={styles.introduction}>
          <Text style={styles.subtitle}>বাড়ি ভাড়ার হিসাব</Text>
          <Text style={styles.description}>প্রথম পরীক্ষামূলক স্ক্রিন</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.canvas,
  },
  content: {
    flexGrow: 1,
    padding: 20,
    gap: 24,
  },
  title: {
    color: colors.ink,
    fontSize: 28,
    lineHeight: 40,
    fontWeight: '600',
  },
  introduction: {
    backgroundColor: colors.surface,
    borderRadius: 20,
    padding: 24,
    gap: 8,
    boxShadow: [
      { offsetX: 0, offsetY: 3, blurRadius: 14, color: colors.softShadow },
    ],
  },
  subtitle: {
    color: colors.ink,
    fontSize: 22,
    lineHeight: 34,
    fontWeight: '600',
  },
  description: {
    color: colors.muted,
    fontSize: 18,
    lineHeight: 30,
  },
});
