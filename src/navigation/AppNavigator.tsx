import { useState } from "react";
import { DefaultTheme, NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../features/home/HomeScreen";
import { PropertiesScreen } from "../features/properties/PropertiesScreen";
import { PropertyForm } from "../features/properties/PropertyForm";
import type { Property } from "../features/properties/propertyStore";
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
  const [form, setForm] = useState<{ property?: Property }>();
  const [propertyRevision, setPropertyRevision] = useState(0);
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
          {() => (
            <PropertiesScreen
              revision={propertyRevision}
              onAdd={() => setForm({})}
              onEdit={(property) => setForm({ property })}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Home" options={{ title: t("home") }}>
          {({ navigation }) => (
            <HomeScreen
              empty={empty}
              onAddProperty={() => {
                navigation.navigate("Properties");
                setForm({});
              }}
            />
          )}
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
      {form && (
        <PropertyForm
          property={form.property}
          onClose={() => setForm(undefined)}
          onSaved={() => {
            setPropertyRevision((value) => value + 1);
            setForm(undefined);
          }}
        />
      )}
    </NavigationContainer>
  );
}
