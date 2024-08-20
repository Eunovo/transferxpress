import { CustomPressable } from "@/_components/Button/CustomPressable"
import { NormalText } from "@/_components/Text/NormalText"
import { flagsAndSymbol } from "@/utils/constants"
import { Image, TextInput, View } from "react-native"
import CaretIcon from "@/assets/icons/caret_solid.svg";
import { HeaderText, HeaderTextStyles } from "@/_components/Text/HeaderText";
import { moderateScale } from "react-native-size-matters";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { useState } from "react";
import { type Currency, CurrencyOptionsModal } from "./CurrencyModal";



export const TransferAmount = ()=>{

    const [showCurrencyModal,setShowCurrencyModal] = useState(false);
    const [activeCurrency, setActiveCurrency] = useState<Currency>({
        ticker: "NGN",
        flag: flagsAndSymbol["NGN"].icon
    })
    return(
      <View>

<View
style={{
    gap: 24
}}
className="w-full"
        >
            <View
className="w-full bg-dark py-3 px-2 rounded-xl"
>
    <NormalText
    size={12}
    className="text-white/80"
    >
       Amount to send
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
   className="text-primary" 
        keyboardType="number-pad"
    />

    <View
    style={{
        width: moderateScale(90, 0.1)
    }}
    className="flex-row justify-center items-center p-2 bg-secondary rounded-xl"
    >
    <Image
          source={flagsAndSymbol.USD.icon}
          width={18}
          height={12}
          className="rounded w-[18px] h-[15px]"
        />
        <HeaderText
         size={14}
         weight={600} className="text-primary/80 mx-2">
         USD
        </HeaderText>
    </View>
    </View>
</View>
<View
className="w-full bg-dark py-3 px-2 rounded-xl"
>
    <NormalText
    size={12}
    className="text-white/80"
    >
        Recipient will recieve
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
   className="text-primary" 
        keyboardType="number-pad"
    />

    <CustomPressable
    onPress={()=>{
        setShowCurrencyModal(true)
    }}
    className="flex-row items-center p-2 bg-secondary rounded-xl"
    >
    <Image
          source={flagsAndSymbol[activeCurrency.ticker as keyof typeof flagsAndSymbol].icon}
          width={18}
          height={12}
          className="rounded w-[18px] h-[15px]"
        />
        <HeaderText
         size={14}
         weight={600} className="text-primary/80 mx-2">
          {activeCurrency.ticker}
        </HeaderText>
        <View className="w-[10px] h-[10px]">
          <CaretIcon fill={"#ECB365"} fillOpacity={0.8} width={"100%"} height={"100%"} />
        </View>
    </CustomPressable>
    </View>
</View>
        </View>

        <View
        style={{
            gap: 12
        }}
        className="w-full p-4 mt-10 border border-secondary rounded-xl">
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
                    Your USD balance
                </NormalText>

            <NormalText
            size={14}
            className="text-white/80"
            >
   5000
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
                   Exchange rate
                </NormalText>

            <NormalText
            size={14}
            className="text-white/80"
            >
   1560
            </NormalText>
            </View>
        </View>
        <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
       className="bg-secondary" 
        >
            <NormalText 
            className="text-primary/80"
            >
                Proceed
            </NormalText>
        </ButtonNormal>
 </View>

 {
    showCurrencyModal && (
        <CurrencyOptionsModal 
        active={activeCurrency}
        handleSelectCurrency={(value)=>{
            setActiveCurrency(value)
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