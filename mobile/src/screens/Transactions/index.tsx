import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { FlatList, RefreshControl, View } from "react-native";
import { BackButton } from "@/_components/Button/BackButton";
import { NormalText } from "@/_components/Text/NormalText";
import { Transaction, TransactionRenderItem } from "@/_components/Transactions/TransactionItem";
import { useEffect, useState } from "react";
import { ViewTransactionModal } from "@/_components/Transactions/ViewTransactionModal";
import type { DashboardNavigation, MainBottomTabsParamList } from "@/navigation/UserStack/MainBottomTabs";
import type { RouteProp } from "@react-navigation/native";
import FilterIcon from "@/assets/icons/transaction_filter.svg"
interface Props {
    navigation: DashboardNavigation;
    route: RouteProp<MainBottomTabsParamList, "transactions">
}
export default function Transactions (
    {
navigation,
route
    }:Props
) {
    const todayISOString = new Date().toISOString()
    const transactions:Array<Transaction> = [
        {
            id: 1,
            reference: "a9808989328923223",
            walletId: 32,
            type: "debit",
            amount: "7000",
            createdAt: todayISOString,
            completedAt: todayISOString,
            narration: "Test narration"
        },
        {
            id: 2,
            reference: "a9808989328923223",
            walletId: 32,
            type: "credit",
            amount: "50000",
            createdAt: todayISOString,
            completedAt: todayISOString,
            narration: "Test narration"
        }
    ];
    const [active, setActive] = useState<Transaction>();
    useEffect(() => {
        if (route.params?.transaction && transactions.length) {
          setActive(route.params.transaction);
          navigation.setParams({ transaction: undefined });
        }
      }, [transactions.length]);
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
           <BackButton 
           onPress={()=>{}}
           />
            <HeaderText
   weight={700}
   size={20}
   className="text-primary mb-10"
   >
Transaction History
   </HeaderText>
<View
className="w-full items-end"
>
  <CustomPressable
  style={{
    gap: 12
  }}
  className="flex-row items-center bg-dark px-3 py-2 border border-secondary rounded-xl"
  >
    <NormalText
    size={13}
    className="text-white"
    >
      Filter
    </NormalText>
    <FilterIcon 
    strokeOpacity={0.5}
    width={16}
    height={16}
    />
  </CustomPressable>
</View>
   <View
   className="mt-4 w-full grow rounded-xl"
   >
     {Boolean(transactions.length) && (
              <FlatList
                renderItem={({ item, index }) => (
                  <TransactionRenderItem
                    item={item}
                    index={index}
                    totalTransactions={transactions.length}
                    viewDetails={(item) => {
                      setActive(item);
                    }}
                  />
                )}
                data={transactions}
                keyExtractor={({ id }) => `${id}`}
                className="w-full"
              />
            )}

            {Boolean(!transactions.length) && (
              <View className="pt-[100px] items-center justify-center">
                <NormalText className="text-white/80 text-center">
                  You have no transactions yet.
                </NormalText>
              </View>
            )}
   </View>
            </View>
            {
                active && (
                    <ViewTransactionModal 
                     showModal={Boolean(active)}
                     closeModal={()=>setActive(undefined)}
                     details={active}
                    />
                )
            }
        </LayoutNormal>
    )
}