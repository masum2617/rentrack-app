import { useState } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../features/home/HomeScreen";
import { useLocale } from "../i18n/LocaleProvider";
import { colors } from "../theme/colors";
import { BottomBar } from "./BottomBar";
import { UnavailableScreen } from "./UnavailableScreen";

type Tabs = {
  Ledger: undefined;
  Properties: undefined;
  Home: undefined;
  Tenants: undefined;
  More: undefined;
};
const Tab = createBottomTabNavigator<Tabs>();
const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: colors.canvas,
    card: colors.surface,
    text: colors.ink,
    primary: colors.brand,
    border: colors.line,
  },
};

export function AppNavigator() {
  const { t } = useLocale();
  const [empty, setEmpty] = useState(false);
  return (
    <NavigationContainer theme={theme}>
      <Tab.Navigator
        initialRouteName="Home"
        tabBar={(props) => <BottomBar {...props} />}
        screenOptions={{ headerShown: false, animation: "none" }}
      >
        <Tab.Screen name="Ledger" options={{ title: t("ledger") }}>
          {({ navigation }) => (
            <UnavailableScreen
              title={t("ledger")}
              onHome={() => navigation.navigate("Home")}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Properties" options={{ title: t("properties") }}>
          {({ navigation }) => (
            <UnavailableScreen
              title={t("properties")}
              onHome={() => navigation.navigate("Home")}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Home" options={{ title: t("home") }}>
          {() => <HomeScreen empty={empty} />}
        </Tab.Screen>
        <Tab.Screen name="Tenants" options={{ title: t("tenants") }}>
          {({ navigation }) => (
            <UnavailableScreen
              title={t("tenants")}
              onHome={() => navigation.navigate("Home")}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="More" options={{ title: t("more") }}>
          {({ navigation }) => (
            <UnavailableScreen
              title={t("more")}
              onHome={() => navigation.navigate("Home")}
              empty={empty}
              onPreviewChange={setEmpty}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
