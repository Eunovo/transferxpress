import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { dollarSymbol, flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { useState } from "react";
import { FlatList, Image, View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import EyeOpenIcon from "@/assets/icons/eye.svg";
import EyeClosedIcon from "@/assets/icons/eye_closed.svg";
import { CustomPressable } from "@/_components/Button/CustomPressable";
import { Currencies } from "@/api/rates";
import { SavingsPlan } from "@/screens/Savings";

interface Props {
    plans: SavingsPlan[]
}
export const BalanceList = (
    {
plans
    }:Props
)=>{
    const [showBalance, setShowBalance] = useState(false);
    const balances = [
        {
            currency: "USD",
            amount: "2000"
        },
        {
            currency: "NGN",
            amount: "200000"
        },
        {
            currency: "GBP",
            amount: "20"
        },
        {
            currency: "AUD",
            amount: "200"
        }
    ]
    return(
        <View>
<FlatList 
data={balances}
contentContainerStyle={{
    gap: 16
}}
className="border"
renderItem={({item})=>(
    <View
    style={{
        width: moderateScale(170, 0.3)
    }}
    className="bg-dark border border-secondary rounded-xl p-3"
    >
     <CustomPressable
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={()=>setShowBalance(prev => !prev)}
          >
<View
style={{
    gap: 12
}}
className="flex-row items-center"
>
<Image
                  source= {flagsAndSymbol[item.currency as Currencies].icon}
                  width={25}
                  height={18}
                  className="w-[25px] max-w-[25px] h-[18px] max-h-[18px] rounded"
                />
                       {showBalance ? (
              <EyeClosedIcon stroke={"#fff"} width={16} height={16} />
            ) : (
              <EyeOpenIcon stroke={"#fff"} width={16} height={16} />
            )}
        
</View>
</CustomPressable>
<HeaderText
weight={700}
className="text-primary mb-1 mt-6"
>
{flagsAndSymbol[item.currency as Currencies].symbol } {formatToCurrencyString(item.amount, 2)}
</HeaderText>
<NormalText
size={13}
className="text-white/80"
>
Total {item.currency} Savings Balance    
</NormalText>
    </View>
)}
horizontal
showsHorizontalScrollIndicator={false}
keyExtractor={({currency})=>`${currency}`}
pagingEnabled
bounces={false}
/>
</View>
    )
}