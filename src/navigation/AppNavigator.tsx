import { LedgerNavigator, type LedgerRoutes } from "./LedgerNavigator";
import type { BillListRequest } from '../features/ledger/billFilters';
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
import { UnitForm } from "../features/properties/UnitForm";
import type { Unit } from "../features/properties/unitStore";
import type { Floor } from "../features/properties/floorStore";
import { PropertyForm } from "../features/properties/PropertyForm";
import type { Property } from "../features/properties/propertyStore";
import { useLocale } from "../i18n/LocaleProvider";
import { colors } from "../theme/colors";
import { BottomBar } from "./BottomBar";
import { UnavailableScreen } from "./UnavailableScreen";

import { TenantsScreen } from "../features/tenants/TenantsScreen";
import { TenantForm } from "../features/tenants/TenantForm";

import { TenancyForm } from "../features/tenancies/TenancyForm";
import type { UnitContext } from "../features/properties/unitContext";
import type { CurrentTenancy } from "../features/tenancies/tenancyStore";

type Tabs = {
  Ledger: NavigatorScreenParams<LedgerRoutes> | undefined;
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
  const [tenantForm, setTenantForm] = useState<{
    tenantId?: number;
    selectedUnitId?: number;
  }>();
  const [tenantRevision, setTenantRevision] = useState(0);
  const [tenantSaved, setTenantSaved] = useState(false);
  const [tenancyForm, setTenancyForm] = useState<{
    context: UnitContext;
    tenancy?: CurrentTenancy;
  }>();
  const [ledgerRequest, setLedgerRequest] = useState<BillListRequest>();
  const [form, setForm] = useState<{ property?: Property }>();
  const [floorForm, setFloorForm] = useState<{
    property: Property;
    floor?: Floor;
  }>();
  const [notice, setNotice] = useState<PropertyNotice>();
  const [unitForm, setUnitForm] = useState<{
    property: Property;
    floor: Floor;
    unit?: Unit;
  }>();
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
            <LedgerNavigator
              request={ledgerRequest}
              revision={propertyRevision}
              onChanged={() => setPropertyRevision((value) => value + 1)}
              onOpenProperties={() =>
                navigation.navigate("Properties", { screen: "HouseList" })
              }
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Properties" options={{ title: t("properties") }}>
          {() => (
            <PropertiesNavigator
              onStartTenancy={(context) => {
                setNotice(undefined);
                setTenancyForm({ context });
              }}
              onCorrectTenancy={(context, tenancy) => {
                setNotice(undefined);
                setTenancyForm({ context, tenancy });
              }}
              onOpenTenant={(tenantId, selectedUnitId) => {
                setTenantSaved(false);
                setTenantForm({ tenantId, selectedUnitId });
              }}
              onBillingChanged={() => setPropertyRevision((value) => value + 1)}
              revision={propertyRevision}
              notice={notice}
              onAdd={() => setForm({})}
              onEdit={(property) => setForm({ property })}
              onAddFloor={(property) => setFloorForm({ property })}
              onEditFloor={(property, floor) =>
                setFloorForm({ property, floor })
              }
              onAddUnit={(property, floor) => setUnitForm({ property, floor })}
              onEditUnit={(property, floor, unit) =>
                setUnitForm({ property, floor, unit })
              }
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Home" options={{ title: t("home") }}>
          {({ navigation }) => (
            <HomeScreen
              revision={propertyRevision + tenantRevision}
              onChanged={() => setPropertyRevision(value => value + 1)}
              onOpenProperties={() => navigation.navigate('Properties', { screen: 'HouseList' })}
              onOpenBills={scope => {
                setLedgerRequest(previous => ({ id: (previous?.id ?? 0) + 1, scope }));
                navigation.navigate('Ledger', { screen: 'Bills' });
              }}
              onAddProperty={() => {
                navigation.navigate("Properties", { screen: "HouseList" });
                setForm({});
              }}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="Tenants" options={{ title: t("tenants") }}>
          {() => (
            <TenantsScreen
              revision={tenantRevision + propertyRevision}
              notice={tenantSaved ? "tenantSaved" : undefined}
              onAdd={() => {
                setTenantSaved(false);
                setTenantForm({});
              }}
              onEdit={(tenant) => {
                setTenantSaved(false);
                setTenantForm({ tenantId: tenant.id });
              }}
            />
          )}
        </Tab.Screen>
        <Tab.Screen name="More" options={{ title: t("more") }}>
          {({ navigation }) => (
            <UnavailableScreen
              title={t("more")}
              onHome={() => navigation.navigate("Home")}
            />
          )}
        </Tab.Screen>
      </Tab.Navigator>
      {tenancyForm && (
        <TenancyForm
          context={tenancyForm.context}
          tenancy={tenancyForm.tenancy}
          onClose={() => setTenancyForm(undefined)}
          onSaved={() => {
            setPropertyRevision((value) => value + 1);
            setNotice({
              message: "tenancySaved",
              propertyId: tenancyForm.context.property.id,
              floorId: tenancyForm.context.floor.id,
              unitId: tenancyForm.context.unit.id,
            });
            setTenancyForm(undefined);
          }}
        />
      )}
      {tenantForm && (
        <TenantForm
          key={tenantForm.tenantId ?? "new"}
          tenantId={tenantForm.tenantId}
          selectedUnitId={tenantForm.selectedUnitId}
          onClose={() => setTenantForm(undefined)}
          onSaved={() => {
            setTenantRevision((value) => value + 1);
            setPropertyRevision((value) => value + 1);
            setTenantSaved(true);
            setTenantForm(undefined);
          }}
        />
      )}
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
      {unitForm && (
        <UnitForm
          property={unitForm.property}
          floor={unitForm.floor}
          unit={unitForm.unit}
          onClose={() => setUnitForm(undefined)}
          onSaved={() => {
            setPropertyRevision((value) => value + 1);
            setNotice({
              message: "unitSaved",
              propertyId: unitForm.property.id,
              floorId: unitForm.floor.id,
            });
            setUnitForm(undefined);
          }}
        />
      )}
    </NavigationContainer>
  );
}
