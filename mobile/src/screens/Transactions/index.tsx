import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { FlatList, RefreshControl, View } from "react-native";
import { BackButton } from "@/_components/Button/BackButton";
import { NormalText } from "@/_components/Text/NormalText";
import { TransactionRenderItem } from "@/_components/Transactions/TransactionItem";
import { useEffect, useState } from "react";
import { ViewTransactionModal } from "@/_components/Transactions/ViewTransactionModal";
import type { DashboardNavigation, MainBottomTabsParamList } from "@/navigation/UserStack/MainBottomTabs";
import type { RouteProp } from "@react-navigation/native";
import FilterIcon from "@/assets/icons/transaction_filter.svg"
import { useQuery } from "@tanstack/react-query";
import { GET_TRANSACTIONS, type Transaction } from "@/api/transactions";
import { ScreenLoader } from "@/_components/loader_utils/ScreenLoader";
import { moderateScale } from "react-native-size-matters";


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
const transactionsQuery = useQuery({
  queryKey: ["getUserTransactions"],
  queryFn: ()=>GET_TRANSACTIONS()
});
const transactions = transactionsQuery.data?.data || [];
    const [active, setActive] = useState<Transaction>();
    useEffect(() => {
        if (route.params?.transaction && transactions.length) {
          setActive(route.params.transaction);
          navigation.setParams({ transaction: undefined });
        }
      }, [transactions.length, route.params]);
      const isLoading = transactionsQuery.isFetching
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
           <BackButton 
           onPress={()=>{
            navigation.goBack()
           }}
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
   style={{
    marginBottom: moderateScale(80, 0.1),
   }}
   className="mt-4 pb-10 w-full grow rounded-xl"
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
    {isLoading && <ScreenLoader opacity={0.6} />}
        </LayoutNormal>
    )
}