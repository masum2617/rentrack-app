import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { PropertiesScreen } from '../features/properties/PropertiesScreen';
import { HouseDetailsScreen } from '../features/properties/HouseDetailsScreen';
import { FloorDetailsScreen } from '../features/properties/FloorDetailsScreen';
import type { Unit } from '../features/properties/unitStore';
import type { Property } from '../features/properties/propertyStore';
import type { Floor } from '../features/properties/floorStore';
import type { MessageKey } from '../i18n/messages';

export type PropertyRoutes = {
  HouseList: undefined;
  HouseDetails: { propertyId: number };
  FloorDetails: { propertyId: number; floorId: number };
};
export type PropertyNotice = { message: MessageKey; propertyId: number; floorId?: number };
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
}: {
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
            onOpenFloor={(floorId) => navigation.navigate('FloorDetails', { propertyId: route.params.propertyId, floorId })}
          />
        )}
      </Stack.Screen>
      <Stack.Screen name="FloorDetails">{({ navigation, route }) =>
        <FloorDetailsScreen key={`${route.params.propertyId}:${route.params.floorId}`} propertyId={route.params.propertyId} floorId={route.params.floorId} revision={revision}
          notice={notice?.propertyId === route.params.propertyId && notice.floorId === route.params.floorId ? notice.message : undefined}
          onBack={() => navigation.goBack()} onEditFloor={onEditFloor} onAddUnit={onAddUnit} onEditUnit={onEditUnit} />
      }</Stack.Screen>
    </Stack.Navigator>
  );
}
