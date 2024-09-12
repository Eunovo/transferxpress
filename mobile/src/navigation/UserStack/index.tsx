
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import MainBottomTabNavigator from "./MainBottomTabs";
import TransferNavigationStack from "./TransferStack";
import DepositNavigationStack from "./DepositStack";
import SwapNavigationStack from "./SwapStack";
import { Transaction } from "@/api/transactions";
import Transactions from "@/screens/Transactions";


type UserStackParam = {
"main-bottom-tab": undefined;
"transfer-stack":undefined;
"deposit-stack": undefined;
"swap-stack" : undefined;
  transactions?: {
    transaction: Transaction
  };
};
export type UserNavigationStack = NavigationProp<UserStackParam>;
export const UserNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      // initialRouteName="transfer-stack"
>
<Stack.Screen name="main-bottom-tab" component={MainBottomTabNavigator} />
<Stack.Screen name="transfer-stack" component={TransferNavigationStack} />
<Stack.Screen name="deposit-stack" component={DepositNavigationStack} />
<Stack.Screen name="swap-stack" component={SwapNavigationStack} />
<Stack.Screen name="transactions" component={Transactions} />
</Stack.Navigator>
    );
}