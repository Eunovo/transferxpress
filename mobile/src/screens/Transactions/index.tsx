import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { View } from "react-native";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import ArrowIcon from "@/assets/icons/arrow.svg"
import { BackButton } from "@/_components/Button/BackButton";


export default function Transactions () {
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
           <BackButton 
           onPress={()=>{}}
           />
            <HeaderText
   weight={700}
   size={24}
   className="text-primary"
   >
   Send money
   </HeaderText>
            </View>
        </LayoutNormal>
    )
}