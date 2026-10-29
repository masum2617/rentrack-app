import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { BillListScreen } from '../features/ledger/BillListScreen';
import { BillDetailsScreen } from '../features/ledger/BillDetailsScreen';
import { PaymentHistoryScreen } from '../features/ledger/PaymentHistoryScreen';
import { PaymentReceiptScreen } from '../features/ledger/PaymentReceiptScreen';
import type { BillListRequest } from '../features/ledger/billFilters';

export type LedgerRoutes = {
  Bills: undefined;
  BillDetails: { billId: number };
  PaymentHistory: { tenancyId: number; billId?: number };
  PaymentReceipt: { paymentId: number };
};
const Stack = createNativeStackNavigator<LedgerRoutes>();
export function LedgerNavigator({
  revision,
  onChanged,
  onOpenProperties,
  request,
}: {
  revision: number;
  onChanged: () => void;
  onOpenProperties: () => void;
  request?: BillListRequest;
}) {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Bills">
        {({ navigation }) => (
          <BillListScreen
            key={request?.id ?? 0}
            initialScope={request?.scope}
            revision={revision}
            onOpenBill={(billId) =>
              navigation.navigate('BillDetails', { billId })
            }
            onChanged={onChanged}
            onOpenProperties={onOpenProperties}
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
            onChanged={onChanged}
            onReplace={(billId) =>
              navigation.replace('BillDetails', { billId })
            }
            onPaymentHistory={(tenancyId, billId) =>
              navigation.navigate('PaymentHistory', { tenancyId, billId })
            }
            onReceipt={(paymentId) =>
              navigation.navigate('PaymentReceipt', { paymentId })
            }
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
            onChanged={onChanged}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
