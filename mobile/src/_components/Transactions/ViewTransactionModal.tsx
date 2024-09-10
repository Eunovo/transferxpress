import { flagsAndSymbol, SCREEN_HEIGHT } from "@/utils/constants"
import { View } from "react-native"
import RNModal from "react-native-modal";
import { HeaderText } from "../Text/HeaderText";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { NormalText } from "../Text/NormalText";
import CalendarIcon from "@/assets/icons/calendar.svg"
import { moderateScale } from "react-native-size-matters";
import { CustomPressable } from "../Button/CustomPressable";
import XmarkIcon from "@/assets/icons/x_mark.svg";
import { Transaction } from "@/api/transactions";


interface Props {
    showModal: boolean;
    closeModal: () => void;
    details: Transaction;
}
export const ViewTransactionModal = (
    {
showModal,
closeModal,
details
    }:Props
)=>{
    return(
        <RNModal
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
        isVisible={showModal}
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        backdropOpacity={0.5}
        backdropColor="#101010"
        deviceHeight={SCREEN_HEIGHT}
        onBackdropPress={() => closeModal()}
        swipeDirection={"down"}
        onSwipeComplete={closeModal}
        statusBarTranslucent
      >
        <View
          style={{ flex: 1 }}
          className="bg-background rounded-t-xl px-6 py-8 max-h-[90%]"
        >
                  <View className="items-center flex-row justify-between mb-10">
      <HeaderText size={18} weight={600} className="text-primary my-4">
             Transaction details
              </HeaderText>
      <CustomPressable
                onPress={closeModal}
                style={{
                    width: moderateScale(40, 0.1),
                    height: moderateScale(40, 0.1)
                }}
                className="ml-auto bg-dark border border-secondary rounded-full items-center justify-center"
              >
                <XmarkIcon width={24} height={24} fill="#ECB365" />
              </CustomPressable>
      </View>
<HeaderText
size={20}
className="text-primary text-center mb-2"
>
{flagsAndSymbol[details.currencyCode].symbol} {formatToCurrencyString(details.amount, 2)}
</HeaderText>
<View 
style={{
    gap: 4
}}
className="flex-row items-center justify-center mb-10"
>
<CalendarIcon 
width={moderateScale(14)}
height={moderateScale(14)}
/>
<NormalText
size={13}
className="text-white/80">
12:00AM . 20 Oct, 2024
   </NormalText>
</View>
<View className="w-full bg-dark p-3 border border-secondary rounded-xl mb-6">
    <View
    className="w-full flex-row justify-between border-b border-b-white/20 pb-4 mb-4"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
To
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
    George Munbdy
</NormalText>
    </View>

    <View
    className="w-full flex-row justify-between border-b border-b-white/20 pb-4 mb-4"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Account no.
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
1234567890
</NormalText>
    </View>

    <View
    className="w-full flex-row justify-between"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Status
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
Successful
</NormalText>
    </View>
</View>
<View className="w-full flex-row justify-between bg-dark p-3 border border-secondary rounded-xl mb-6">
<NormalText
                size={14}
                className="text-white/80"
                >
Narration 
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
{details.narration}
</NormalText>
</View>
<View className="w-full bg-dark p-3 border border-secondary rounded-xl">
    <View
    className="w-full flex-row justify-between border-b border-b-white/20 pb-4 mb-4"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Reference
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white w-[50%]"
                >
{details.reference}
</NormalText>
    </View>

    <View
    className="w-full flex-row justify-between"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Fees
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
0.5
</NormalText>
    </View>
</View>
            </View>
            </RNModal>
    )
}