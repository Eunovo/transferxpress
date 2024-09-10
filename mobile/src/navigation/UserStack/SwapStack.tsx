
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import SwapAmount from "@/screens/swap/swapAmount";
import SwapSummary from "@/screens/swap/summary";
import SwapPinConfirmation from "@/screens/swap/pinConfirmation";
import SwapSuccess from "@/screens/swap/success";


type SwapStackParam = {
"swap-amount": undefined;
"swap-summary":undefined;
'swap-pin' : undefined;
"swap-success": undefined
};
export type SwapNavigationStackType = NavigationProp<SwapStackParam>;
const SwapNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="swap-amount"
>
<Stack.Screen name="swap-amount" component={SwapAmount} />
<Stack.Screen name="swap-summary" component={SwapSummary} />
<Stack.Screen name="swap-pin" component={SwapPinConfirmation} />
<Stack.Screen name="swap-success" component={SwapSuccess} />
</Stack.Navigator>
    );
}

export default SwapNavigationStack