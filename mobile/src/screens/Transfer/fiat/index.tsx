import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { TransferAmount } from "@/_components/Transfer/fiat/TransferAmount";
import { View } from "react-native";
import { TransferDetails } from "@/_components/Transfer/fiat/TransferDetails";
import { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { UserNavigationStack } from "@/navigation/UserStack";
import { BackButton } from "@/_components/Button/BackButton";



export default function TransferFiat (){
    const navigation = useNavigation<UserNavigationStack>()
    const [isNextStage, setIsNextStage] = useState(false);
    
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
                <BackButton
           onPress={()=>{
            if(isNextStage){
                setIsNextStage(false)
               }
               else{
               navigation.navigate("main-bottom-tab")
               }
           }}
           />
            <HeaderText
   weight={700}
   size={18}
   className="text-primary"
   >
   Send money
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
{
    isNextStage ? "Please enter recipients details" : "  How much do you want to transfer?"
}
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