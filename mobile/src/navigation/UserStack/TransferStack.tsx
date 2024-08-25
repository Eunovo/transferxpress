
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import TransferFiat from "@/screens/Transfer/fiat";
import TransferFiatSummary from "@/screens/Transfer/fiat/summary";
import TransferSuccess from "@/screens/Transfer/fiat/success";
import TransferPayout from "@/screens/Transfer/fiat/payout";

type TransferStackParam = {
"transfer-fiat-form": undefined;
"transfer-fiat-summary": undefined;
"transfer-fiat-payout": undefined;
"transfer-fiat-success": undefined
};
export type TransferNavigationStackType = NavigationProp<TransferStackParam>;
const TransferNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="transfer-fiat-form"
>
<Stack.Screen name="transfer-fiat-form" component={TransferFiat} />
<Stack.Screen name="transfer-fiat-summary" component={TransferFiatSummary} />
<Stack.Screen name="transfer-fiat-payout" component={TransferPayout} />
<Stack.Screen name="transfer-fiat-success" component={TransferSuccess} />
</Stack.Navigator>
    );
}

export default TransferNavigationStack