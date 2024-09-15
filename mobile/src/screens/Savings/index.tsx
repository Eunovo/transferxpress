import { LayoutWithScroll } from "@/_components/layouts/LayoutWithScroll";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { useState } from "react";
import { RefreshControl, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import { CustomPressable } from "@/_components/Button/CustomPressable";
import { BalanceList } from "@/_components/Savings/BalanceList";
import { useNavigation } from "@react-navigation/native";
import { UserNavigationStack } from "@/navigation/UserStack";
import { ViewSavingsPlanModal } from "@/_components/Savings/ViewSavingsPlan";
import { useQuery } from "@tanstack/react-query";
import { GET_SAVINGS_PLANS, SavingsPlan } from "@/api/savings";
import { ScreenLoader } from "@/_components/loader_utils/ScreenLoader";
import PlusWithCircleIcon from "@/assets/icons/plus_with_circle.svg"


export default function Savings (){
    const navigation  = useNavigation<UserNavigationStack>();
    const [active, setActive] = useState<SavingsPlan>();
    const savingsPlanQuery = useQuery({
        queryKey: ["getSavingsPlans"],
        queryFn: ()=>GET_SAVINGS_PLANS(),
        refetchOnMount: "always"
    });
    const savingsPlans = savingsPlanQuery.data?.data ||  []
    return(
        <LayoutWithScroll
        refreshControl={
            <RefreshControl
              refreshing={savingsPlanQuery.isRefetching}
              onRefresh={() => {
              savingsPlanQuery.refetch()
              }}
              colors={["#ECB365"]}
              tintColor={"#ECB365"}
              style={{ marginTop: 20 }}
            />
          }
        >
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
plans={savingsPlans}
/>
{
    Boolean(savingsPlans.length) && (
               <CustomPressable
               onPress={()=>navigation.navigate("savings-stack")}
               style={{
                 gap: 8,
                 width: moderateScale(110, 0.3)
               }}
               className="flex-row items-center justify-center px-3 py-3 bg-secondary rounded-xl mt-10">
             <PlusWithCircleIcon
             fill={"#ECB365"}
            width={moderateScale(20, 0.3)}
            height={moderateScale(20, 0.3)}
            opacity={0.8}
            />
               <NormalText size={15} weight={500} className="text-primary/80">
               Add plan
               </NormalText>
             </CustomPressable>
    )
}
<View className="mt-10 flex-1">
{
    Boolean(savingsPlans.length) && (
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
                savingsPlans.map(item => (
                    <CustomPressable
                    key={item.id}
                    onPress={()=>setActive(item)}
                    >
                    <View
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
                        </CustomPressable>
                ))
            }
        </View>
    )
}
   {
   
   (!Boolean(savingsPlans.length) && !savingsPlanQuery.isPending) && (
        <View
        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
     className="items-center my-auto"
     >
     <NormalText
     className="text-white/80 mb-4"
     >
            You have no active savings plan
            </NormalText>
            <CustomPressable
               onPress={()=>navigation.navigate("savings-stack")}
               style={{
                 gap: 8
               }}
               className="w-[80%] flex-row items-center justify-center px-3 py-3 bg-secondary rounded-xl mt-10">
             <PlusWithCircleIcon
             fill={"#ECB365"}
            width={moderateScale(20, 0.3)}
            height={moderateScale(20, 0.3)}
            opacity={0.8}
            />
               <NormalText size={15} weight={500} className="text-primary/80">
               Create savings plan
               </NormalText>
             </CustomPressable>
     </View>
    )
}
</View>
            </View>
            {
             active && (
                    <ViewSavingsPlanModal 
                    showModal={Boolean(active)}
                    closeModal={()=>setActive(undefined)}
                    details={active}
                    />
                )
            }
            {
                savingsPlanQuery.isPending && <ScreenLoader opacity={0.6} />
            }
        </LayoutWithScroll>
    )
}