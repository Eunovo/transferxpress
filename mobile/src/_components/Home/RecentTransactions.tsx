import { View } from "react-native"
import { HeaderText } from "../Text/HeaderText"
import { CustomPressable } from "../Button/CustomPressable"
import { moderateScale } from "react-native-size-matters"
import { NormalText } from "../Text/NormalText"
import { TransactionRenderItem, type Transaction } from "../Transactions/TransactionItem"
import { useNavigation } from "@react-navigation/native"
import { DashboardNavigation } from "@/navigation/UserStack/MainBottomTabs"

export const RecentTransactions = ()=>{
    const navigation = useNavigation<DashboardNavigation>();
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
    ];
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
<View className="w-full grow p-3 border border-secondary bg-dark rounded-2xl">
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