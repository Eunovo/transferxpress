import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { TransferAmount } from "@/_components/Transfer/fiat/TransferAmount";
import { View } from "react-native";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import ArrowIcon from "@/assets/icons/arrow.svg"
import { TransferDetails } from "@/_components/Transfer/fiat/TransferDetails";
import { useState } from "react";



export default function TransferFiat (){

    const [isNextStage, setIsNextStage] = useState(false);
    
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
            <CustomPressable
            onPress={()=>{
            if(isNextStage){
             setIsNextStage(false)
            }
            else{
            //    navigate to prev screen
            }
            }}
                style={{
                    width: moderateScale(40, 0.3),
                    height: moderateVerticalScale(40, 0.3)
                }}
                className="rounded-full bg-primary items-center justify-center mb-4"
                >
                    <ArrowIcon
                  fill={"#04293A"}
                  width={moderateScale(20, 0.3)}
                  height={moderateVerticalScale(20, 0.3)}
                    />
                </CustomPressable>
            <HeaderText
   weight={700}
   size={24}
   className="text-primary"
   >
   Send money
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
  How much do you want to transfer?
   </NormalText>
   {
    !isNextStage ? (
<TransferAmount 
goToNextStage={()=>setIsNextStage(true)}
/> 
    ) : (
<TransferDetails
/>
    )
   }


            </View>
        </LayoutNormal>
    )
}