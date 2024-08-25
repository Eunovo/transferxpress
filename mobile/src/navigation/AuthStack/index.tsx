
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import Login from "../../screens/login";
import SignupPersonalInformation from "@/screens/signup/personalInformaton";
import SignupCreatePassword from "@/screens/signup/createPassword";
import SignupEmailVerification from "@/screens/signup/emailVerification";

type AuthStackParam = {
login: undefined;
"email-verification": undefined;
"personal-info": undefined;
"create-password": undefined
};
export type AuthNavigationStack = NavigationProp<AuthStackParam>;
export const AuthNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      // initialRouteName="personal-info"
>
<Stack.Screen name="login" component={Login} />
<Stack.Group >
  <Stack.Screen name="email-verification" component={SignupEmailVerification} />
  <Stack.Screen name="personal-info" component={SignupPersonalInformation} />
  <Stack.Screen name="create-password" component={SignupCreatePassword} />
</Stack.Group>
</Stack.Navigator>
    );
}