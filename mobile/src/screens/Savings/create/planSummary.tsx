import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { View } from "react-native";
import { moderateScale} from "react-native-size-matters";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { BackButton } from "@/_components/Button/BackButton";
import { useUserState } from "@/store/user/useUserState";
import { useTransferState } from "@/store/transfer/useTransferState";
import { SavingsNavigationStackType } from "@/navigation/UserStack/SavingsStack";
import { formatDate } from "@/utils/formatDate";
import { useSavingsPlanState } from "@/store/savingsPlan/useSavingsPlanState";

interface Props {
    navigation: SavingsNavigationStackType
};
const today = new Date().toISOString();
export default function PlanSummary (
    {
navigation
    }:Props
){
    const {activeWallet} = useUserState();
    const {savingsAmount, fundingCurrency, name, lockPeriod} = useSavingsPlanState()
    const fundingCurrencySymbol = flagsAndSymbol[fundingCurrency].symbol;
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
Plan Summary
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
Confirm the details of your plan
   </NormalText>
   <View
        style={{
            gap: 12
        }}
        className="w-full p-4 border border-secondary rounded-xl">
            <HeaderText
className="text-primary"
>
 Plan Information
</HeaderText>
<View
            className="flex-row justify-between border-b border-b-primary/20 pb-3"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
              Plan name
                </NormalText>

            <NormalText
            size={14}
            weight={500}
            className="text-white"
            >
{name}
            </NormalText>
            </View>
<View
            className="flex-row justify-between border-b border-b-primary/20 pb-3"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
               Periodic amount
                </NormalText>

            <NormalText
            size={14}
            weight={500}
            className="text-white"
            >
{fundingCurrencySymbol} {formatToCurrencyString(savingsAmount, 2)}
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
              Payment method
                </NormalText>

            <NormalText
            size={14}
            weight={500}
            className="text-white"
            >
{fundingCurrency} Wallet
            </NormalText>
            </View>

            <HeaderText
className="text-primary mt-10"
>
Date and Frequency
</HeaderText>
<View
            className="flex-row justify-between border-b border-b-primary/20 pb-3"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
           Start on
                </NormalText>

            <NormalText
            size={14}
            weight={500}
            className="text-white"
            >
{formatDate(today)}
            </NormalText>
            </View>
            <View
            className="flex-row justify-between border-b border-b-primary/20 pb-3"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
          Frequency 
                </NormalText>

            <NormalText
            size={14}
            weight={500}
            className="text-white"
            >
 Monthly
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
        Lock period
                </NormalText>

            <NormalText
            size={14}
            weight={500}
            className="text-white capitalize"
            >
{lockPeriod}
            </NormalText>
            </View>
        </View>

        <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
 onPress={()=>navigation.navigate("create-plan-success")}
       className="bg-secondary" 
        >
            <NormalText 
            className="text-primary/80"
            >
                Start plan
            </NormalText>
        </ButtonNormal>
 </View>
            </View>
        </LayoutNormal>
    )
}