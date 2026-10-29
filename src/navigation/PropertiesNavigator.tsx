import { BillListScreen } from '../features/ledger/BillListScreen';
import { BillDetailsScreen } from '../features/ledger/BillDetailsScreen';
import { PaymentHistoryScreen } from '../features/ledger/PaymentHistoryScreen';
import { PaymentReceiptScreen } from '../features/ledger/PaymentReceiptScreen';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PropertiesScreen } from '../features/properties/PropertiesScreen';
import { HouseDetailsScreen } from '../features/properties/HouseDetailsScreen';
import { UnitDetailsScreen } from '../features/properties/UnitDetailsScreen';
import type { UnitContext } from '../features/properties/unitContext';
import type { CurrentTenancy } from '../features/tenancies/tenancyStore';
import { FloorDetailsScreen } from '../features/properties/FloorDetailsScreen';
import type { Unit } from '../features/properties/unitStore';
import type { Property } from '../features/properties/propertyStore';
import type { Floor } from '../features/properties/floorStore';
import type { MessageKey } from '../i18n/messages';

export type PropertyRoutes = {
  PaymentHistory: { tenancyId: number; billId?: number };
  PaymentReceipt: { paymentId: number };
  UnitBills: { tenancyId: number };
  BillDetails: { billId: number };
  UnitDetails: { unitId: number };
  HouseList: undefined;
  HouseDetails: { propertyId: number };
  FloorDetails: { propertyId: number; floorId: number };
};
export type PropertyNotice = {
  message: MessageKey;
  propertyId: number;
  floorId?: number;
  unitId?: number;
};
const Stack = createNativeStackNavigator<PropertyRoutes>();
export function PropertiesNavigator({
  revision,
  notice,
  onAdd,
  onEdit,
  onAddFloor,
  onEditFloor,
  onAddUnit,
  onEditUnit,
  onStartTenancy,
  onCorrectTenancy,
  onOpenTenant,
  onBillingChanged,
}: {
  onStartTenancy: (context: UnitContext) => void;
  onOpenTenant: (tenantId: number, unitId: number) => void;
  onCorrectTenancy: (context: UnitContext, tenancy: CurrentTenancy) => void;
  onBillingChanged: () => void;
  revision: number;
  notice?: PropertyNotice;
  onAdd: () => void;
  onEdit: (property: Property) => void;
  onAddFloor: (property: Property) => void;
  onEditFloor: (property: Property, floor: Floor) => void;
  onAddUnit: (property: Property, floor: Floor) => void;
  onEditUnit: (property: Property, floor: Floor, unit: Unit) => void;
}) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HouseList">
        {({ navigation }) => (
          <PropertiesScreen
            revision={revision}
            notice={notice?.message}
            onAdd={onAdd}
            onEdit={onEdit}
            onOpen={(propertyId) =>
              navigation.navigate('HouseDetails', { propertyId })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="HouseDetails">
        {({ navigation, route }) => (
          <HouseDetailsScreen
            key={route.params.propertyId}
            propertyId={route.params.propertyId}
            revision={revision}
            notice={
              notice?.propertyId === route.params.propertyId
                ? notice.message
                : undefined
            }
            onBack={() => navigation.goBack()}
            onEditHouse={onEdit}
            onAddFloor={onAddFloor}
            onEditFloor={onEditFloor}
            onOpenFloor={(floorId) =>
              navigation.navigate('FloorDetails', {
                propertyId: route.params.propertyId,
                floorId,
              })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="FloorDetails">
        {({ navigation, route }) => (
          <FloorDetailsScreen
            key={`${route.params.propertyId}:${route.params.floorId}`}
            propertyId={route.params.propertyId}
            floorId={route.params.floorId}
            revision={revision}
            notice={
              notice?.propertyId === route.params.propertyId &&
              notice.floorId === route.params.floorId
                ? notice.message
                : undefined
            }
            onBack={() => navigation.goBack()}
            onEditFloor={onEditFloor}
            onAddUnit={onAddUnit}
            onEditUnit={onEditUnit}
            onOpenTenant={onOpenTenant}
            onOpenUnit={(unitId) =>
              navigation.navigate('UnitDetails', { unitId })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="UnitDetails">
        {({ navigation, route }) => (
          <UnitDetailsScreen
            key={route.params.unitId}
            unitId={route.params.unitId}
            revision={revision}
            notice={
              notice?.unitId === route.params.unitId &&
              notice.message === 'tenancySaved'
            }
            onBack={() => navigation.goBack()}
            onEdit={(context) =>
              onEditUnit(context.property, context.floor, context.unit)
            }
            onOpenTenant={onOpenTenant}
            onOpenBills={(tenancyId) =>
              navigation.navigate('UnitBills', { tenancyId })
            }
            onStart={onStartTenancy}
            onCorrect={onCorrectTenancy}
            onBillingChanged={onBillingChanged}
            onPaymentHistory={(tenancyId) =>
              navigation.navigate('PaymentHistory', { tenancyId })
            }
            onReceipt={(paymentId) =>
              navigation.navigate('PaymentReceipt', { paymentId })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="UnitBills">
        {({ navigation, route }) => (
          <BillListScreen
            key={route.params.tenancyId}
            tenancyId={route.params.tenancyId}
            revision={revision}
            onBack={() => navigation.goBack()}
            onOpenBill={(billId) =>
              navigation.navigate('BillDetails', { billId })
            }
            onOpenProperties={() => navigation.navigate('HouseList')}
            onChanged={onBillingChanged}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PaymentHistory">
        {({ navigation, route }) => (
          <PaymentHistoryScreen
            key={`${route.params.tenancyId}:${route.params.billId ?? 'all'}`}
            tenancyId={route.params.tenancyId}
            billId={route.params.billId}
            revision={revision}
            onBack={() => navigation.goBack()}
            onReceipt={(paymentId) =>
              navigation.navigate('PaymentReceipt', { paymentId })
            }
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="PaymentReceipt">
        {({ navigation, route }) => (
          <PaymentReceiptScreen
            key={route.params.paymentId}
            paymentId={route.params.paymentId}
            revision={revision}
            onBack={() => navigation.goBack()}
            onChanged={onBillingChanged}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="BillDetails">
        {({ navigation, route }) => (
          <BillDetailsScreen
            key={route.params.billId}
            billId={route.params.billId}
            revision={revision}
            onBack={() => navigation.goBack()}
            onReplace={(billId) =>
              navigation.replace('BillDetails', { billId })
            }
            onChanged={onBillingChanged}
            onPaymentHistory={(tenancyId, billId) =>
              navigation.navigate('PaymentHistory', { tenancyId, billId })
            }
            onReceipt={(paymentId) =>
              navigation.navigate('PaymentReceipt', { paymentId })
            }
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
