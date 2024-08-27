import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutWithScroll } from "@/_components/layouts/LayoutWithScroll";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { useState } from "react";
import { Image, ScrollView, View } from "react-native";
import { moderateScale} from "react-native-size-matters";
import PlusIcon from "@/assets/icons/plus_bold.svg";
import { RecentTransactions } from "@/_components/Home/RecentTransactions";
import { WalletList } from "@/_components/Home/WalletList";
import { useUserState } from "@/store/user/useUserState";



type Rates = {
    [currency: string]: {
        currency: string;
        rate: number;
    }[];
};
export default function Home (){
 const exchnageRates: Rates = {
    KES: [
        {
            currency: "NGN",
            rate: 11
        }
    ],
    NGN: [
        {
            currency: "USD",
            rate: 1560
        },
        {
            currency: "KES",
            rate: 0.003
        }
    ],
    USD: [
        {
            currency: "NGN",
            rate: 0.00062
        },
        {
            currency: "KES",
            rate: 140
        }
    ],
 };
 const {activeWallet} = useUserState()
    return(
        <LayoutWithScroll>
            <View className="w-full grow pb-10">
                <HeaderText
                size={20}
                weight={600}
                className="text-primary mb-4"
                >
                    Welcome Back, User
                </HeaderText>
<WalletList />
                <View
                style={{
                    gap: 16
                }}
                className="w-full mt-4">
                <CustomPressable
style={{
    gap: 8
}}
className="w-full flex-row items-center justify-center px-3 py-3 bg-secondary rounded-xl"
>
    <PlusIcon 
    fill={"#ECB365"}
    fillOpacity={0.8}
    />
    <NormalText
    size={15}
    weight={500}
    className="text-primary/80"
    >
        Recieve Money
    </NormalText>
</CustomPressable>
                </View>
                <View className="w-full flex-1 mt-6">
                    <NormalText 
                    size={13}
                    className="text-white/80 mb-3">
                        Market rates
                    </NormalText>
               <ScrollView
               contentContainerStyle={{
                gap: 12
               }}
               className="grow-0"
              horizontal
              >
{
                    exchnageRates[activeWallet.ticker].map( item => (
                        <View
                        key={item.currency}
                        style={{
                            width:moderateScale(120, 0.3)
                        }}
                        className="bg-dark border border-secondary rounded-xl p-3"
                        >
                               <View
            style={{
                gap: 8
            }}
            className="flex-row items-center mb-1"
            >
            <Image
                      source={flagsAndSymbol[item.currency as keyof typeof flagsAndSymbol].icon}
                      width={18}
                      height={12}
                      className="rounded w-[18px] h-[15px]"
                    />
            <NormalText
            size={12}
            className="text-white"
            >
                {item.currency}
            </NormalText>
            </View>
                         <HeaderText
                         size={13}
                         weight={600}
                         className="text-white"
                         >
                         {flagsAndSymbol[item.currency as keyof typeof flagsAndSymbol].symbol}{formatToCurrencyString( item.rate < 1 ?  (1 / item.rate) : item.rate, 2)}
                         </HeaderText>
                        </View>
                    ))
                }
               </ScrollView>
  <RecentTransactions />
                </View>
            </View>
        </LayoutWithScroll>
    )
}