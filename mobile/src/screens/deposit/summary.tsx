import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { View } from "react-native";
import { moderateScale} from "react-native-size-matters";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { BackButton } from "@/_components/Button/BackButton";
import { useDepositState } from "@/store/deposit/useDepositState";
import { DepositNavigationStackType } from "@/navigation/UserStack/DepositStack";
import { useUserState } from "@/store/user/useUserState";

interface Props {
    navigation: DepositNavigationStackType
}
export default function DepositSummary (
    {
navigation
    }:Props
){
    const {activeWallet} = useUserState()
    const {amount, currency, exchangeRate} = useDepositState();
    const sendingCurrencySymbol = flagsAndSymbol[currency as keyof typeof flagsAndSymbol].symbol;
    const receivingCurrencySymbol = flagsAndSymbol[activeWallet.ticker as keyof typeof flagsAndSymbol].symbol;
       const fee = 0.75;
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
            <BackButton
    onPress={()=>navigation.goBack()}
/>
            <HeaderText
   weight={700}
   size={20}
   className="text-primary"
   >
 Transaction Review
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
Confirm the details of your transaction
   </NormalText>
   <View
        style={{
            gap: 12
        }}
        className="w-full p-4 border border-secondary rounded-xl">
            <HeaderText
className="text-primary"
>
 Transaction Information
</HeaderText>
<View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
               Amount to send
                </NormalText>

            <NormalText
            size={14}
            weight={500}
            className="text-white"
            >
{sendingCurrencySymbol} {formatToCurrencyString((amount + fee), 2)}
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
                  Your {activeWallet.ticker} wallet will receive
                </NormalText>

            <NormalText
            size={14}
        weight={500}
            className="text-white"
            >
{receivingCurrencySymbol} {formatToCurrencyString(amount, 2)}
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
                   Fees
                </NormalText>

            <NormalText
            size={14}
          weight={500}
            className="text-white"
            >
 {sendingCurrencySymbol} {formatToCurrencyString(fee, 2)}
            </NormalText>
            </View>
    
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
                   Exchange rate
                </NormalText>

            <NormalText
            size={14}
         weight={500}
            className="text-white"
            >
 {sendingCurrencySymbol} {exchangeRate ? (1 / Number(exchangeRate)).toFixed(4) : 0}
            </NormalText>
            </View>
           
     
        </View>

        <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
 onPress={()=>navigation.navigate("deposit-payout")}
       className="bg-secondary" 
        >
            <NormalText 
            className="text-primary/80"
            >
                Confirm and Proceed
            </NormalText>
        </ButtonNormal>
 </View>
            </View>
        </LayoutNormal>
    )
}