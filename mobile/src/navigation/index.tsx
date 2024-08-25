import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import { AuthNavigationStack } from "./AuthStack";
import { UserNavigationStack } from "./UserStack";

type MainStackParam = {
UserStack: undefined;
AuthStack: undefined;
};
export type MainNavigationStack = NavigationProp<MainStackParam>;
export const MainNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      // initialRouteName="UserStack"
>
<Stack.Screen name="AuthStack" component={AuthNavigationStack} />
<Stack.Screen name="UserStack" component={UserNavigationStack} />
</Stack.Navigator>
    );
}