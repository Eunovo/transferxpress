
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import DepositSelectPaymentMethod from "@/screens/deposit/selectMethod";
import { DepositAmount } from "@/screens/deposit/depositAmount";
import DepositSummary from "@/screens/deposit/summary";
import DepositPayout from "@/screens/deposit/payout";
import DepositSuccess from "@/screens/deposit/success";

type DepositStackParam = {
"deposit-select-method":undefined;
"deposit-amount": undefined;
"deposit-summary": undefined;
"deposit-payout": undefined;
"deposit-success":undefined
};
export type DepositNavigationStackType = NavigationProp<DepositStackParam>;
const DepositNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="deposit-amount"
>
<Stack.Screen name="deposit-select-method" component={DepositSelectPaymentMethod} />
<Stack.Screen name="deposit-amount" component={DepositAmount} />
<Stack.Screen name="deposit-summary" component={DepositSummary} />
<Stack.Screen name="deposit-payout" component={DepositPayout} />
<Stack.Screen name="deposit-success" component={DepositSuccess} />
</Stack.Navigator>
    );
}

export default DepositNavigationStack