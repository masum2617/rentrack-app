import { useState } from "react";
import {
  DefaultTheme,
  NavigationContainer,
  useNavigationContainerRef,
  type NavigatorScreenParams,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { HomeScreen } from "../features/home/HomeScreen";
import {
  PropertiesNavigator,
  type PropertyRoutes,
  type PropertyNotice,
} from "./PropertiesNavigator";
import { FloorForm } from "../features/properties/FloorForm";
import { UnitForm } from '../features/properties/UnitForm';
import type { Unit } from '../features/properties/unitStore';
import type { Floor } from "../features/properties/floorStore";
import { PropertyForm } from "../features/properties/PropertyForm";
import type { Property } from "../features/properties/propertyStore";
import { useLocale } from "../i18n/LocaleProvider";
import { colors } from "../theme/colors";
import { BottomBar } from "./BottomBar";
import { UnavailableScreen } from "./UnavailableScreen";

type Tabs = {
  Ledger: undefined;
  Properties: NavigatorScreenParams<PropertyRoutes> | undefined;
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
  const [floorForm, setFloorForm] = useState<{
    property: Property;
    floor?: Floor;
  }>();
  const [notice, setNotice] = useState<PropertyNotice>();
  const [unitForm, setUnitForm] = useState<{ property: Property; floor: Floor; unit?: Unit }>();
  const navigationRef = useNavigationContainerRef<Tabs>();
  const [propertyRevision, setPropertyRevision] = useState(0);
  return (
    <NavigationContainer theme={theme} ref={navigationRef}>
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
            <PropertiesNavigator
              revision={propertyRevision}
              notice={notice}
              onAdd={() => setForm({})}
              onEdit={(property) => setForm({ property })}
              onAddFloor={(property) => setFloorForm({ property })}
              onEditFloor={(property, floor) =>
                setFloorForm({ property, floor })
              }
              onAddUnit={(property, floor) => setUnitForm({ property, floor })}
              onEditUnit={(property, floor, unit) => setUnitForm({ property, floor, unit })}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Home" options={{ title: t("home") }}>
          {({ navigation }) => (
            <HomeScreen
              empty={empty}
              onAddProperty={() => {
                navigation.navigate("Properties", { screen: "HouseList" });
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
          onSaved={(propertyId) => {
            setPropertyRevision((value) => value + 1);
            setNotice({ message: "houseSaved", propertyId });
            if (!form.property)
              navigationRef.navigate("Properties", {
                screen: "HouseDetails",
                params: { propertyId },
                initial: false,
              });
            setForm(undefined);
          }}
        />
      )}
      {floorForm && (
        <FloorForm
          property={floorForm.property}
          floor={floorForm.floor}
          onClose={() => setFloorForm(undefined)}
          onSaved={() => {
            setPropertyRevision((value) => value + 1);
            setNotice({
              message: "floorSaved",
              propertyId: floorForm.property.id,
              floorId: floorForm.floor?.id,
            });
            setFloorForm(undefined);
          }}
        />
      )}
      {unitForm && <UnitForm property={unitForm.property} floor={unitForm.floor} unit={unitForm.unit} onClose={() => setUnitForm(undefined)} onSaved={() => {
        setPropertyRevision((value) => value + 1);
        setNotice({ message: 'unitSaved', propertyId: unitForm.property.id, floorId: unitForm.floor.id });
        setUnitForm(undefined);
      }} />}
    </NavigationContainer>
  );
}
