import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
import { Text, View } from 'react-native';

import { LocaleProvider } from './src/i18n/LocaleProvider';
import { AppNavigator } from './src/navigation/AppNavigator';
import { colors } from './src/theme/colors';

export default function App() {
  const [loaded, error] = useFonts({
    BengaliRegular: require('./assets/fonts/NotoSansBengali_400Regular.ttf'),
    BengaliMedium: require('./assets/fonts/NotoSansBengali_500Medium.ttf'),
    BengaliSemiBold: require('./assets/fonts/NotoSansBengali_600SemiBold.ttf'),
    EnglishRegular: require('./assets/fonts/NotoSans_400Regular.ttf'),
    EnglishMedium: require('./assets/fonts/NotoSans_500Medium.ttf'),
    EnglishSemiBold: require('./assets/fonts/NotoSans_600SemiBold.ttf'),
  });
  if (!loaded) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          padding: 24,
          backgroundColor: colors.canvas,
        }}
      >
        <Text
          accessibilityRole="alert"
          style={{ fontSize: 18, color: colors.ink }}
        >
          {error
            ? 'লেখার ফন্ট লোড হয়নি। অ্যাপটি আবার খুলুন।'
            : 'অ্যাপ প্রস্তুত হচ্ছে…'}
        </Text>
      </View>
    );
  }
  return (
    <SafeAreaProvider>
      <StatusBar style="dark" />
      <LocaleProvider>
        <AppNavigator />
      </LocaleProvider>
    </SafeAreaProvider>
  );
}
