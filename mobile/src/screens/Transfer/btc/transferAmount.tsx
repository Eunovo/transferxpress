import { BackButton } from "@/_components/Button/BackButton";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { CustomTextInput } from "@/_components/FormComponents/CustomInput";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { TransferNavigationStackType } from "@/navigation/UserStack/TransferStack";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface Props {
    navigation : TransferNavigationStackType
}
export default function TransferAmountBTC (
    {
navigation
    }: Props
) {
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
            <BackButton
    onPress={ async()=>{
    navigation.goBack()

    }}
/>
            <HeaderText
   weight={700}
   size={20}
   className="text-primary"
   >
Send BTC
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
How much do you want to transfer?
   </NormalText>
            <View className="w-full">
<CustomTextInput
title="Amount to send"
placeholder="Enter amount"
/>
</View>
<View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] my-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
 onPress={async()=>{
navigation.navigate("transfer-btc-summary")
 }}
       className="bg-secondary" 
        >
            <NormalText
            className="text-primary/80"
            >
              Proceed
            </NormalText>
        </ButtonNormal>
 </View>
            </View>
        </LayoutNormal>
    )
}