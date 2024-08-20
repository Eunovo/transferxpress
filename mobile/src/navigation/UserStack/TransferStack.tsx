
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import TransferFiat from "@/screens/Transfer/fiat";

type TransferStackParam = {
"transfer-fiat-form": undefined
};
export type TransferNavigationStack = NavigationProp<TransferStackParam>;
export const TransferNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="transfer-fiat-form"
>
<Stack.Screen name="transfer-fiat-form" component={TransferFiat} />
</Stack.Navigator>
    );
}