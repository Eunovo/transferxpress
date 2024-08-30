import { CustomPressable } from "@/_components/Button/CustomPressable"
import { HeaderText, HeaderTextStyles } from "@/_components/Text/HeaderText"
import { NormalText } from "@/_components/Text/NormalText"
import { Image, TextInput, View } from "react-native"
import { moderateScale } from "react-native-size-matters"
import { type Currency, CurrencyOptionsModal } from "./CurrencyModal"
import { useState } from "react"
import { flagsAndSymbol } from "@/utils/constants"
import CaretIcon from "@/assets/icons/caret_solid.svg";
import { formatNumberWithCommas } from "@/utils/formatNumberWithCommas"


interface Props {
active: {
    currency: string;
    amount: string;
};
title: string;
setAmount: (value:string)=>void;
setCurrency: (value:string)=>void;
isReadOnly?:boolean
}
export const CurrencyAmountInput = (
    {
active,
title,
setAmount,
setCurrency,
isReadOnly
    }:Props
)=>{
    const [showCurrencyModal,setShowCurrencyModal] = useState(false);
    return(
<View>
<View
className="w-full bg-dark py-3 px-2 rounded-xl"
>
    <NormalText
    size={12}
    className="text-white/80"
    >
      {title}
    </NormalText>
    <View
    style={{
        gap: 16
    }}
    className="flex-row w-full justify-between"
    >
    <TextInput
    style={{
        flex: 1,
        fontSize: moderateScale(18, 0.1),
        fontWeight: HeaderTextStyles.fontSemiBold.fontWeight,
        fontFamily: HeaderTextStyles.fontSemiBold.fontFamily
    }}
    placeholder="0.00"
    placeholderTextColor={"rgba(255, 255, 255, 0.6)"}
    value={active.amount ? formatNumberWithCommas(active.amount) : ""}
    onChangeText={(text) => {
      const formatted = text.replaceAll(",", "");
      setAmount(formatted)
    }}
   
   className="text-primary" 
        keyboardType="number-pad"
    />

    <CustomPressable
    disabled={isReadOnly}
    onPress={()=>{
        setShowCurrencyModal(true)
    }}
    className="flex-row items-center p-2 bg-secondary rounded-xl"
    >
    <Image
          source={flagsAndSymbol[active.currency as keyof typeof flagsAndSymbol].icon}
          width={18}
          height={12}
          className="rounded w-[18px] h-[15px]"
        />
        <HeaderText
         size={14}
         weight={600} className="text-primary/80 mx-2">
          {active.currency}
        </HeaderText>
      {
        !isReadOnly && (
            <View className="w-[10px] h-[10px]">
            <CaretIcon fill={"#ECB365"} fillOpacity={0.8} width={"100%"} height={"100%"} />
          </View>
        )
      }
    </CustomPressable>
    </View>
</View>
        {
            showCurrencyModal && (
                <CurrencyOptionsModal
                active={active.currency}
                handleSelectCurrency={(value)=>{
                    setCurrency(value)
                    setShowCurrencyModal(false)
                }}
                showModal={showCurrencyModal}
                closeModal={()=>setShowCurrencyModal(false)}
                />
            )
         }
              </View>
    )
}