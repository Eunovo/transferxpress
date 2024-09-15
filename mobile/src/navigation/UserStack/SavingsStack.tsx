
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import PlanSummary from "@/screens/savings/create/planSummary";
import PlanSuccess from "@/screens/savings/create/success";
import PlanName from "@/screens/savings/create/planName";
import PlanAmount from "@/screens/savings/create/planAmount";
import PlanSchedule from "@/screens/savings/create/PlanScheduleDetails";
import { WithdrawalAmount } from "@/screens/savings/withdrawal/withdrwalAmount";
import SavingsWithdrawalSummary from "@/screens/savings/withdrawal/summary";
import WithdrwalinConfirmation from "@/screens/savings/withdrawal/pinConfirmation";
import SavingsWithdrawaluccess from "@/screens/savings/withdrawal/success";
import FundingPinConfirmation from "@/screens/savings/funding/pinConfirmation";
import { Currencies } from "@/api/rates";
import { FundingAmount } from "@/screens/savings/funding/fundingAmount";
import SavingsFundingSummary from "@/screens/savings/funding/fundingSummary";
import FundingSuccess from "@/screens/savings/funding/success";



export type SavingsStackParamList = {
    "create-plan-name": undefined;
    "create-plan-amount": undefined;
    "create-plan-schedule": undefined;
    "create-plan-summary": undefined;
    "create-plan-success": undefined;
    "withdraw-amount": {
        walletd: number
    };
    "withdraw-summary": undefined;
    "withdraw-pin": undefined;
    "withdraw-success": undefined;
    "funding-amount": {
      planId: string;
      planCurrency: Currencies;
      amount?:string
    };
    "funding-summary"?: {
      isFromPlanCreation: boolean
    };
    "funding-pin"?: {
      isFromPlanCreation: boolean
    };
    "funding-success"?: {
      isFromPlanCreation: boolean
    };
};
export type SavingsNavigationStackType = NavigationProp<SavingsStackParamList>;
const SavingsNavigationStack = ()=>{
    const Stack = createNativeStackNavigator<SavingsStackParamList>();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      
>
  <Stack.Group>
  <Stack.Screen name="create-plan-name" component={PlanName} />
    <Stack.Screen name="create-plan-amount" component={PlanAmount} />
    <Stack.Screen name="create-plan-schedule" component={PlanSchedule} />
    <Stack.Screen name="create-plan-summary" component={PlanSummary} />
    <Stack.Screen name="create-plan-success" component={PlanSuccess} />
  </Stack.Group>
<Stack.Group>
<Stack.Screen name="withdraw-amount" component={WithdrawalAmount} />
<Stack.Screen name="withdraw-summary" component={SavingsWithdrawalSummary} />
<Stack.Screen name="withdraw-pin" component={WithdrwalinConfirmation} />
<Stack.Screen name="withdraw-success" component={SavingsWithdrawaluccess} />
</Stack.Group>
<Stack.Group>
  <Stack.Screen name="funding-amount" component={FundingAmount} />
  <Stack.Screen name="funding-summary" component={SavingsFundingSummary} />
  <Stack.Screen name="funding-pin" component={FundingPinConfirmation} />
  <Stack.Screen name="funding-success" component={FundingSuccess} />
</Stack.Group>
</Stack.Navigator>
    );
}

export default SavingsNavigationStack