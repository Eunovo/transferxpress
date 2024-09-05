import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { View } from "react-native";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import CopyIcon from "@/assets/icons/copy.svg"
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { TransferNavigationStackType } from "@/navigation/UserStack/TransferStack";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { BackButton } from "@/_components/Button/BackButton";

interface Props {
    navigation: TransferNavigationStackType
}
export default function TransferPayout (
    {
navigation
    }:Props
) {
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
<BackButton
    onPress={()=>navigation.goBack()}
/>
            <HeaderText
   weight={700}
   size={20}
   className="text-primary"
   >
Send money
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
Transfer to account details below
   </NormalText>
   <View 
   style={{
    gap: 40
   }}
   className="w-full p-4 bg-dark border border-secondary rounded-xl"
   >
<View
style={{
    gap: 4
}}
className="items-center pb-4 border-b border-secondary"
>
    <NormalText
    size={12}
    className="text-white/80"
    >
        Amount to send
    </NormalText>
    <HeaderText
    size={20}
    weight={600}
    className="text-primary"
    >
        {flagsAndSymbol.KES.symbol} {formatToCurrencyString(40000, 2)}
    </HeaderText>
</View>

<View
className="w-full flex-row items-center justify-between"
>
<NormalText
className="text-white/80"
>
    Account Name
</NormalText>
<View 
style={{
    gap: 8
}}
className="flex-row items-center">
<NormalText
weight={500}
className="text-white"
>
    Test User
</NormalText>
<CopyIcon
fill={"#ECB365"}
fillOpacity={0.6}
width={moderateScale(16, 0.1)}
height={moderateVerticalScale(16, 0.1)}
/>
</View>
</View>
<View
className="w-full flex-row items-center justify-between"
>
<NormalText
className="text-white/80"
>
    Account Number
</NormalText>
<View 
style={{
    gap: 8
}}
className="flex-row items-center">
<NormalText
weight={500}
className="text-white"
>
   1234567890
</NormalText>
<CopyIcon
fill={"#ECB365"}
fillOpacity={0.6}
width={moderateScale(16, 0.1)}
height={moderateVerticalScale(16, 0.1)}
/>
</View>
</View>


   </View>

   <View
                    style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                    className="pt-[64px] mt-auto w-full mx-auto justify-start"
                  >
<ButtonNormal 
onPress={()=>{
    navigation.navigate("transfer-fiat-success")
}}
className="w-full bg-secondary">
    <NormalText
     weight={500} className="text-primary/80">
        I have sent the money
    </NormalText>
</ButtonNormal>
<CustomPressable>
<View 
className="flex-wrap flex-row justify-center mt-2"
>
<NormalText 
weight={500}
className="text-white/80">
   Cancel Transfer
</NormalText>
</View>
</CustomPressable>
</View>
   </View>
   </LayoutNormal>
    )
}
