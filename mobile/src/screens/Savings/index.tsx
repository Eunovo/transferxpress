import { LayoutWithScroll } from "@/_components/layouts/LayoutWithScroll";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { dollarSymbol, flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { useState } from "react";
import { Image, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import EyeOpenIcon from "@/assets/icons/eye.svg";
import EyeClosedIcon from "@/assets/icons/eye_closed.svg";
import { CustomPressable } from "@/_components/Button/CustomPressable";
import { BalanceList } from "@/_components/Savings/BalanceList";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { Currencies } from "@/api/rates";
import { useNavigation } from "@react-navigation/native";
import { UserNavigationStack } from "@/navigation/UserStack";

export type SavingsPlan = {
    id: string;
    name: string;
    currencyCode: Currencies;
    balance: string;
    autoFund: boolean;
    durationInMonths: number;
    startDate: string;
    maturityDate: string;
    state: "ACTIVE" | "MATURED";
    penalties: any
    };
const MOCK_PLANS: SavingsPlan[] = [
    {
        id: "1",
        name: "Test Plan 1",
        currencyCode: "USD",
        balance: "4000",
        autoFund: true,
        durationInMonths: 6,
        startDate: "",
        maturityDate: "",
        state: "ACTIVE",
        penalties: []
    },
    {
        id: "2",
        name: "Test Plan 2",
        currencyCode: "NGN",
        balance: "400000",
        autoFund: false,
        durationInMonths: 1,
        startDate: "",
        maturityDate: "",
        state: "ACTIVE",
        penalties: []
    }
]
export default function Savings (){
    const navigation  = useNavigation<UserNavigationStack>()
    return(
        <LayoutWithScroll>
            <View className="grow pb-10">
            <HeaderText
weight={600}
size={24}
className="mb-10 text-primary"
>
   Savings
</HeaderText>  
<NormalText
size={14}
className="text-white/80 mb-2"
>
   Total Balances
</NormalText>
<BalanceList
plans={MOCK_PLANS}
/>
{
    Boolean(MOCK_PLANS.length) && (
        <ButtonNormal
        onPress={()=>navigation.navigate("savings-stack")}
        style={{
            width: moderateScale(110, 0.3)
        }}
        className="bg-secondary mt-4"
        >
            <NormalText
            weight={500}
            className="text-primary/80"
            >
                Add plan
            </NormalText>
        </ButtonNormal>
    )
}
<View className="mt-10 flex-1">
{
    Boolean(MOCK_PLANS.length) ? (
        <View
        style={{
            gap: 16
        }}
        >
            <HeaderText
            weight={600}
            className="text-primary mb-2"
            >
                Your Plans
            </HeaderText>
            {
                MOCK_PLANS.map(item => (
                    <View
                    key={item.id}
                    className="bg-dark border border-secondary rounded-xl py-3"
                    >
                        <View
                        className="flex-row items-center justify-between px-3"
                        >
                            <NormalText
                            weight={500}
                            className="text-primary"
                            >
                                {item.name}
                            </NormalText>
                            <View
                            className="bg-secondary rounded-xl p-2"
                            >
                                <NormalText
                                size={12}
                                weight={600}
                                className="text-[#55A249]"
                                >
                                    Active
                                </NormalText>
                                </View>
                            </View>
                            <View className="border-t border-t-white/20 my-4" />
                            <View
                        className="flex-row items-center justify-between px-3"
                        >
                            <View>
                                <NormalText
                                size={12}
                                className="text-white/80"
                                >
                                    Savings balance
                                </NormalText>
                                <NormalText
                                size={13}
                                weight={600}
                                   className="text-white/80"
                                >
                                  {flagsAndSymbol[item.currencyCode].symbol}  {formatToCurrencyString(item.balance, 2)}
                                </NormalText>
                                </View>
                                </View>
                        </View>
                ))
            }
        </View>
    ) : (
        <View
        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
     className="items-center my-auto"
     >
     <NormalText
     className="text-white/80 mb-4"
     >
            You have no active savings plan
            </NormalText>
            <ButtonNormal
            className="bg-secondary"
            >
                <NormalText
                weight={500}
                className="text-primary/80"
                >
                    Create savings plan
                </NormalText>
            </ButtonNormal>
     </View>
    )
}
</View>
            </View>
        </LayoutWithScroll>
    )
}