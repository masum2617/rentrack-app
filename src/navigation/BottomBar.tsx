import { Pressable, StyleSheet, View, useWindowDimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { AssetIcon, type IconName } from '../shared/ui/AssetIcon';
import { AppText } from '../shared/ui/AppText';
import { colors } from '../theme/colors';

function routeIcon(name: string): IconName {
  switch (name) {
    case 'Ledger':
      return 'ledger';
    case 'Properties':
      return 'properties';
    case 'Tenants':
      return 'tenants';
    case 'More':
      return 'more';
    default:
      return 'home';
  }
}
export function BottomBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  return (
    <View
      style={[
        styles.bar,
        {
          paddingBottom: Math.max(insets.bottom, 8),
          paddingLeft: Math.max(insets.left, 20),
          paddingRight: Math.max(insets.right, 20),
        },
      ]}
    >
      <View pointerEvents="none" style={styles.background} />
      <View style={styles.row}>
        {state.routes.map((route, index) => {
          const focused = state.index === index;
          const home = route.name === 'Home';
          const label = descriptors[route.key].options.title ?? route.name;
          function onPress() {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!focused && !event.defaultPrevented)
              navigation.navigate(route.name);
          }
          return (
            <Pressable
              key={route.key}
              accessibilityRole="tab"
              accessibilityLabel={label}
              accessibilityState={{ selected: focused }}
              onPress={onPress}
              onLongPress={() =>
                navigation.emit({ type: 'tabLongPress', target: route.key })
              }
              style={({ pressed }) => [
                styles.item,
                home && styles.homeItem,
                pressed && styles.pressed,
              ]}
            >
              <View
                style={[
                  styles.icon,
                  focused && styles.selected,
                  home && styles.homeIcon,
                  home && focused && styles.homeSelected,
                ]}
              >
                <AssetIcon
                  name={routeIcon(route.name)}
                  tint={
                    home && focused
                      ? colors.surface
                      : focused
                        ? colors.brand
                        : colors.muted
                  }
                />
              </View>
              <AppText
                variant="nav"
                maxFontSizeMultiplier={width < 380 ? 1.15 : 1.3}
                color={focused ? colors.brand : colors.muted}
                style={styles.label}
              >
                {label}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  bar: {
    paddingTop: 8,
  },
  background: {
    position: 'absolute',
    top: 26,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: colors.surface,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    boxShadow: [
      { offsetX: 0, offsetY: -3, blurRadius: 18, color: 'rgba(52,81,58,0.09)' },
    ],
  },
  row: { flexDirection: 'row', alignItems: 'flex-end', minHeight: 72 },
  item: {
    flex: 1,
    minHeight: 72,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    minWidth: 0,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selected: { backgroundColor: colors.selected },
  homeItem: {
    minHeight: 98,
    justifyContent: 'flex-start',
    gap: 0,
  },
  homeIcon: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 7,
    borderColor: colors.surface,
    backgroundColor: colors.selected,
    boxShadow: [
      { offsetX: 0, offsetY: 0, blurRadius: 14, color: 'rgba(52,81,58,0.13)' },
    ],
  },
  homeSelected: { backgroundColor: colors.sage },
  label: { textAlign: 'center', alignSelf: 'stretch', paddingHorizontal: 2 },
  pressed: { opacity: 0.7 },
});
