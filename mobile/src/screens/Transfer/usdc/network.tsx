import { BackButton } from "@/_components/Button/BackButton";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { CustomTextInput } from "@/_components/FormComponents/CustomInput";
import { ListBottomSheet } from "@/_components/FormComponents/ListBottomSheet";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { TransferNavigationStackType } from "@/navigation/UserStack/TransferStack";
import { useState } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface Props {
    navigation : TransferNavigationStackType
}
const NETWORK_OPTIONS = [
    {
        value: "ethereum"
    },
{
    value:"polygon"
}
]
export default function TransferNetworkUSDC (
    {
navigation
    }: Props
) {
    const [active, setActive] = useState("")
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
Send USDC
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
Select Network chain
   </NormalText>
            <View className="w-full">
            <ListBottomSheet
      title="Network"
        required
        placeholder="Please choose a chain type"
        searchBarPlaceholder="Search for chain"
        fieldValue={active}
        options={NETWORK_OPTIONS}
        selectItem={(value)=>{
            setActive(value.value)
        }}
        isIconBase64
        />
</View>
<View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] my-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
 onPress={async()=>{
navigation.navigate("transfer-usdc-address")
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