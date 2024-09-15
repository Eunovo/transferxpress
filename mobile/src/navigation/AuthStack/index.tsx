
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import Login from "../../screens/login";
import SignupPersonalInformation from "@/screens/signup/personalInformaton";
import SignupCreatePassword from "@/screens/signup/createPassword";
import SignupEmailVerification from "@/screens/signup/emailVerification";
import SignUpCreatePin from "@/screens/signup/createPin";
import SignUpConfirmPin from "@/screens/signup/confirmPin";
import AccountCreateSuccess from "@/screens/signup/success";

export type AuthStackParam = {
login: undefined;
"email-verification": undefined;
"personal-info": {email:string};
"create-password": {
  email: string;
  firstName:string;
  lastName:string;
  country:string;
  phoneNumber:string
};
"create-pin":undefined;
"confirm-pin": undefined;
"create-account-success": undefined
};
export type AuthNavigationStack = NavigationProp<AuthStackParam>;
export const AuthNavigationStack = ()=>{
    const Stack = createNativeStackNavigator<AuthStackParam>();
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
  <Stack.Screen name="create-pin" component={SignUpCreatePin} />
  <Stack.Screen name="confirm-pin" component={SignUpConfirmPin} />
  <Stack.Screen name="create-account-success" component={AccountCreateSuccess} />
</Stack.Group>
</Stack.Navigator>
    );
}