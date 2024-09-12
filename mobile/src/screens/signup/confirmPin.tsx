import { BackButton } from "@/_components/Button/BackButton";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { PinWithKeyPad } from "@/_components/FormComponents/PinwithKeyPad";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { AuthNavigationStack } from "@/navigation/AuthStack";
import { useState } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";


interface Props {
    navigation: AuthNavigationStack;
}
export default function SignUpConfirmPin (
    {
navigation
    }:Props
) {
    const [pin, setPin] = useState<string[]>([]);
    const isDisabled = pin.length < 4;
    return(
        <LayoutNormal>
        <View
        className="w-full grow pb-10">
          <BackButton
              onPress={()=>{
    navigation.goBack()
                 }}
          />
          <HeaderText weight={700} size={20} className="text-primary">
            Confirm PIN
          </HeaderText>
          <NormalText size={13} className="text-white/80 mb-10">
           Confirm your 4 digit PIN
          </NormalText>
  
          <PinWithKeyPad pin={pin} setPin={setPin} />
          <View
            style={{maxWidth: moderateScale(400, 0.3)}}
            className="pt-[64px] mt-auto w-full mx-auto justify-start">
            <ButtonNormal
           onPress={()=>{
          navigation.navigate("create-account-success")
             }}
              disabled={isDisabled}
              className="w-full bg-secondary">
              <NormalText weight={500} className="text-primary/80">
               Confirm and proceed
              </NormalText>
            </ButtonNormal>
          </View>
        </View>
      </LayoutNormal>
    )
}