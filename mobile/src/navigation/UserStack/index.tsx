
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import MainBottomTabNavigator from "./MainBottomTabs";
import { TransferNavigationStack } from "./TransferStack";


type UserStackParam = {
"main-bottom-tab": undefined;
"transfer":undefined
};
export type UserNavigationStack = NavigationProp<UserStackParam>;
export const UserNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="transfer"
>
<Stack.Screen name="main-bottom-tab" component={MainBottomTabNavigator} />
<Stack.Screen name="transfer" component={TransferNavigationStack} />
</Stack.Navigator>
    );
}