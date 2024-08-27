import { View } from "react-native";
import { LayoutWithScroll } from "../../_components/layouts/LayoutWithScroll";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { Formik } from "formik";
import { CustomTextInput } from "@/_components/FormComponents/CustomInput";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import ArrowIcon from "@/assets/icons/arrow.svg"
import { CustomPressable } from "@/_components/Button/CustomPressable";
import { AuthNavigationStack} from "@/navigation/AuthStack";
import { useMutation } from "@tanstack/react-query";
import { VERIFY_EMAIL } from "@/api/auth";
import { BackButton } from "@/_components/Button/BackButton";

interface Props {
    navigation:AuthNavigationStack;
}
export default function SignupEmailVerification (
    {
navigation
    }:Props
){
    const {mutateAsync, isPending} = useMutation({
        mutationFn: VERIFY_EMAIL
    })
    return(
        <LayoutWithScroll>
            <View className="w-full grow pb-10">
            <BackButton
    onPress={()=>navigation.goBack()}
/>
   <HeaderText
   weight={700}
   size={24}
   className="text-primary"
   >
    Create your account
   </HeaderText>
   <NormalText 
size={13}
className="text-white/80 max-w-[90%]">
  Enter your email below to create your Transferxpress account
   </NormalText>
   <Formik
   initialValues={{
email:""
   }}
   onSubmit={async(values)=>{
    try {
        await mutateAsync(values)
        navigation.navigate("personal-info", values)
    } catch (error) {
        return;
    }
   }}
   >
   {
    ({values, handleBlur, handleChange, errors, touched, submitForm, dirty})=>{
        const isDisabled = !dirty || isPending;
        return(
            <View className="w-full grow  mt-10">
           <View className="w-full mb-4">
            <CustomTextInput
    title="Email"
    placeholder="Enter your email"
    onChangeText={handleChange("email")}
defaultValue={values.email}
onBlur={handleBlur("email")}
errorMessage={errors.email}
touched={touched.email}
    />
            </View>
            <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
    <ButtonNormal 
    disabled={isDisabled}
    onPress={()=> submitForm()}
    className="w-full bg-secondary">
        <NormalText weight={500} className="text-primary/80">
          Next
        </NormalText>
    </ButtonNormal>
            </View>
        </View>
        )
    }
   }
   </Formik>
            </View>
        </LayoutWithScroll>
    )
}