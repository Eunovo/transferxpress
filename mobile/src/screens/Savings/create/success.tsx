
import { LayoutNormal } from "@/_components/layouts/LayoutNormal"
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { View } from "react-native";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import CheckmarkIcon from "@/assets/icons/check_mark.svg"
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { useNavigation } from "@react-navigation/native";
import { UserNavigationStack } from "@/navigation/UserStack";
import { useAppDispatch } from "@/store/hooks";
import { clearSavingsPlanState } from "@/store/savingsPlan/slice";
import { useSavingsPlanState } from "@/store/savingsPlan/useSavingsPlanState";


export default function PlanSuccess () {
    const navigation = useNavigation<UserNavigationStack>();
    const dispatch = useAppDispatch();
    const {name, fundingCurrency} = useSavingsPlanState()
    const goBackToHome = ()=>{
        dispatch(clearSavingsPlanState())
        navigation.navigate("main-bottom-tab")
    }
    return(
<LayoutNormal>
<View className="w-full grow pb-10">

<View 
style={{
    gap: 16
}}
className="items-center mt-10 mb-6">
    <View
          style={{
            width: moderateScale(50, 0.3),
            height: moderateScale(50, 0.3)
        }}
        className="rounded-full bg-primary items-center justify-center"
        >
<CheckmarkIcon 
      fill={"#04293A"}
      width={moderateScale(35, 0.3)}
      height={moderateVerticalScale(35, 0.3)}
        />
    </View>
<HeaderText
weight={700}
size={20}
className="text-primary text-center"
>
Savings plan created!
</HeaderText>
<View
style={{
    gap: 4
}}
className="flex-row flex-wrap justify-center items-center max-w-[80%] mx-auto"
>
<NormalText
size={13}
className="text-white/80 text-center">
Congratulations! You have successfully set-up your {fundingCurrency} savings plan, 
<NormalText 
size={13}
weight={500}
className="text-primary capitalize"
>
{" "}{name}.
</NormalText>
   </NormalText>
</View>
</View>

<View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] w-full my-auto  mx-auto justify-start"
                      >
 <ButtonNormal
 onPress={goBackToHome}
       className="bg-secondary" 
        >
            <NormalText 
            className="text-primary/80"
            >
             Done
            </NormalText>
        </ButtonNormal>
 </View>
</View>
</LayoutNormal>

    )
}