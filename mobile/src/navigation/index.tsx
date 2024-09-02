import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import { AuthNavigationStack } from "./AuthStack";
import { UserNavigationStack } from "./UserStack";
import { useAppState } from "@/store/app/useAppState";
import { useAppDispatch } from "@/store/hooks";
import { useEffect } from "react";
import { clearAppState } from "@/store/app/slice";
import { clearUserState } from "@/store/user/slice";

type MainStackParam = {
UserStack: undefined;
AuthStack: undefined;
};
export type MainNavigationStack = NavigationProp<MainStackParam>;
export const MainNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    const dispatch = useAppDispatch()
    const {token} = useAppState()
    useEffect(() => {
      dispatch(clearAppState());
      dispatch(clearUserState());
    }, []);
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      // initialRouteName="UserStack"
>
  {
    Boolean(token) ? (
<Stack.Screen name="UserStack" component={UserNavigationStack} />
    ) : (
<Stack.Screen name="AuthStack" component={AuthNavigationStack} />
    )
   }


</Stack.Navigator>
    );
}