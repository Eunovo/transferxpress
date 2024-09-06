
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import MainBottomTabNavigator from "./MainBottomTabs";
import TransferNavigationStack from "./TransferStack";
import DepositNavigationStack from "./DepositStack";


type UserStackParam = {
"main-bottom-tab": undefined;
"transfer-stack":undefined;
"deposit-stack": undefined;
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
</Stack.Navigator>
    );
}