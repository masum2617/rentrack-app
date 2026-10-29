import type { ReactNode } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocale } from '../../i18n/LocaleProvider';
import { AppText } from '../../shared/ui/AppText';
import { AssetIcon } from '../../shared/ui/AssetIcon';
import { colors } from '../../theme/colors';
import { surfaces } from '../../theme/surfaces';

export function PaymentFormFrame({
  title,
  busy,
  onBack,
  children,
  footer,
}: {
  title: string;
  busy: boolean;
  onBack: () => void;
  children: ReactNode;
  footer?: ReactNode;
}) {
  const { t } = useLocale();
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.canvas }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={{ paddingHorizontal: 20, paddingVertical: 8 }}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t('back')}
            disabled={busy}
            onPress={onBack}
            style={[
              surfaces.control,
              {
                width: 48,
                minHeight: 48,
                alignItems: 'center',
                justifyContent: 'center',
              },
            ]}
          >
            <AssetIcon name="back" />
          </Pressable>
        </View>
        <ScrollView
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          contentContainerStyle={{ padding: 20, gap: 20 }}
        >
          <AppText variant="title" accessibilityRole="header">
            {title}
          </AppText>
          {children}
        </ScrollView>
        {footer && (
          <View
            style={{ padding: 20, gap: 12, backgroundColor: colors.surface }}
          >
            {footer}
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
