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
export default function SignUpCreatePin (
    {
navigation
    }: Props
) {
    const [pin, setPin] = useState<string[]>([]);
    const isDisabled = pin.length < 4;
    return(
        <LayoutNormal>
        <View 
                style={{
                    paddingTop: moderateScale(40, 0.3)
                }}
        className="w-full grow pb-10">
          <HeaderText weight={700} size={20} className="text-primary">
            Create PIN
          </HeaderText>
          <NormalText size={13} className="text-white/80 mb-10">
           Create a 4 digit PIN for authorizing transactions
          </NormalText>
  
          <PinWithKeyPad pin={pin} setPin={setPin} />
          <View
            style={{maxWidth: moderateScale(400, 0.3)}}
            className="pt-[64px] mt-auto w-full mx-auto justify-start">
            <ButtonNormal
           onPress={()=>{
          navigation.navigate("confirm-pin")
             }}
              disabled={isDisabled}
              className="w-full bg-secondary">
              <NormalText weight={500} className="text-primary/80">
                Proceed
              </NormalText>
            </ButtonNormal>
          </View>
        </View>
      </LayoutNormal>
    )
}