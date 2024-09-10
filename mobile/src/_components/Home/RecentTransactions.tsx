import { View } from "react-native"
import { HeaderText } from "../Text/HeaderText"
import { CustomPressable } from "../Button/CustomPressable"
import { moderateScale } from "react-native-size-matters"
import { NormalText } from "../Text/NormalText"
import { TransactionRenderItem,} from "../Transactions/TransactionItem"
import { useNavigation } from "@react-navigation/native"
import { DashboardNavigation } from "@/navigation/UserStack/MainBottomTabs"
import { GET_TRANSACTIONS, Transaction } from "@/api/transactions"
import { useQuery } from "@tanstack/react-query"

export const RecentTransactions = ()=>{
    const navigation = useNavigation<DashboardNavigation>();
    const transactionsQuery = useQuery({
        queryKey: ["getUserTransactions"],
        queryFn: ()=>GET_TRANSACTIONS()
      });
      const transactions = transactionsQuery.data?.data.slice(0, 4) || [];
    return(
        <View className="w-full">
        <View
                  className="w-full flex-row justify-between items-center mb-6"
                  >
                      <HeaderText
                      size={20}
                      weight={600}
                      className="text-primary"
                      >
                          Recent Transactions
                      </HeaderText>
                      <CustomPressable
                      onPress={()=>navigation.navigate("transactions")}
                      style={{
                          maxWidth: moderateScale(100, 0.1)
                      }}
                      className="px-4 py-2 bg-dark border border-primary/60 rounded-xl"
                      >
                          <NormalText
                          size={13}
                          className="text-white/60"
                          >
                              View all
                          </NormalText>
                      </CustomPressable>
                  </View>
<View className="w-full grow rounded-2xl">
     {Boolean(transactions.length) && (
             transactions.map((item, index) =>(
                <TransactionRenderItem
                key={item.id}
                item={item}
                index={index}
                totalTransactions={transactions.length}
                viewDetails={(item) => {
                 navigation.navigate("transactions", {
                    transaction: item
                 })
                }}
              />
             ))
            )}

            {Boolean(!transactions.length) && (
              <View className="my-auto items-center justify-center">
                <NormalText className="text-white/80 text-center">
                  You have no transactions yet.
                </NormalText>
              </View>
            )}
</View>
        </View>
    )
}