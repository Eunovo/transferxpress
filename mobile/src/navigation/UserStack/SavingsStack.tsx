
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import PlanSummary from "@/screens/savings/create/planSummary";
import PlanSuccess from "@/screens/savings/create/success";
import PlanName from "@/screens/savings/create/planName";
import PlanAmount from "@/screens/savings/create/planAmount";
import PlanSchedule from "@/screens/savings/create/PlanScheduleDetails";



type SavingsStackParamList = {
    "create-plan-name": undefined;
    "create-plan-amount": undefined;
    "create-plan-schedule": undefined;
    "create-plan-summary": undefined;
    "create-plan-success": undefined;
};
export type SavingsNavigationStackType = NavigationProp<SavingsStackParamList>;
const SavingsNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      
>
    <Stack.Screen name="create-plan-name" component={PlanName} />
    <Stack.Screen name="create-plan-amount" component={PlanAmount} />
    <Stack.Screen name="create-plan-schedule" component={PlanSchedule} />
    <Stack.Screen name="create-plan-summary" component={PlanSummary} />
    <Stack.Screen name="create-plan-success" component={PlanSuccess} />
</Stack.Navigator>
    );
}

export default SavingsNavigationStack