
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import type { NavigationProp } from "@react-navigation/native";
import TransferFiat from "@/screens/Transfer/fiat";
import TransferFiatSummary from "@/screens/Transfer/fiat/summary";
import TransferSuccess from "@/screens/Transfer/fiat/success";
import TransferPayout from "@/screens/Transfer/fiat/payout";
import TransferAddressBTC from "@/screens/Transfer/btc/address";
import TransferAmountBTC from "@/screens/Transfer/btc/transferAmount";
import TransferSummaryBTC from "@/screens/Transfer/btc/summary";
import TransferSuccessBTC from "@/screens/Transfer/btc/success";
import TransferNetworkUSDC from "@/screens/Transfer/usdc/network";
import TransferAmountUSDC from "@/screens/Transfer/usdc/transferAmount";
import TransferSummaryUSDC from "@/screens/Transfer/usdc/summary";
import TransferSuccessUSDC from "@/screens/Transfer/usdc/success";
import TransferAddressUSDC from "@/screens/Transfer/usdc/address";
import TransferPinConfirmation from "@/screens/Transfer/fiat/pinConfirmation";

type TransferStackParam = {
"transfer-fiat-form": undefined;
"transfer-fiat-summary": undefined;
"transfer-fiat-payout": undefined;
"transfer-fiat-pin":undefined;
"transfer-fiat-success": undefined;
"transfer-btc-address": undefined;
"transfer-btc-amount": undefined;
"transfer-btc-summary": undefined;
"transfer-btc-success": undefined;
"transfer-usdc-network": undefined;
"transfer-usdc-address": undefined;
"transfer-usdc-amount": undefined;
"transfer-usdc-summary": undefined;
"transfer-usdc-success": undefined
};
export type TransferNavigationStackType = NavigationProp<TransferStackParam>;
const TransferNavigationStack = ()=>{
    const Stack = createNativeStackNavigator();
    return(
<Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      // initialRouteName="transfer-fiat-pin"
>
<Stack.Group>
<Stack.Screen name="transfer-fiat-form" component={TransferFiat} />
<Stack.Screen name="transfer-fiat-summary" component={TransferFiatSummary} />
<Stack.Screen name="transfer-fiat-pin" component={TransferPinConfirmation} />
<Stack.Screen name="transfer-fiat-payout" component={TransferPayout} />
<Stack.Screen name="transfer-fiat-success" component={TransferSuccess} />
</Stack.Group>
<Stack.Group>
  <Stack.Screen name="transfer-btc-address" component={TransferAddressBTC} />
  <Stack.Screen name="transfer-btc-amount" component={TransferAmountBTC} />
  <Stack.Screen name="transfer-btc-summary" component={TransferSummaryBTC} />
  <Stack.Screen name="transfer-btc-success" component={TransferSuccessBTC} />
</Stack.Group>
<Stack.Group>
<Stack.Screen name="transfer-usdc-network" component={TransferNetworkUSDC} />
<Stack.Screen name="transfer-usdc-address" component={TransferAddressUSDC} />
  <Stack.Screen name="transfer-usdc-amount" component={TransferAmountUSDC} />
  <Stack.Screen name="transfer-usdc-summary" component={TransferSummaryUSDC} />
  <Stack.Screen name="transfer-usdc-success" component={TransferSuccessUSDC} />
</Stack.Group>
</Stack.Navigator>
    );
}

export default TransferNavigationStack