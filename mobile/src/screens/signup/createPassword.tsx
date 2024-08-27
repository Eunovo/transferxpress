import { View } from "react-native";
import { LayoutWithScroll } from "../../_components/layouts/LayoutWithScroll";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import { PasswordInput } from "@/_components/FormComponents/PasswordInput";
import { Formik } from "formik";
import { getPasswordValidationRules } from "@/utils/constants";
import XmarkIcon from "@/assets/icons/x_mark.svg";
import CheckMarkIcon from "@/assets/icons/check_mark.svg";
import { AuthNavigationStack, AuthStackParam } from "@/navigation/AuthStack";
import { RouteProp } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { REGISTER_USER } from "@/api/auth";
import { Spinner } from "@/_components/loader_utils/Spinner";
import { BackButton } from "@/_components/Button/BackButton";


interface Props {
  navigation: AuthNavigationStack;
  route: RouteProp<AuthStackParam, "create-password">
}
export default function SignupCreatePassword  (
  {
navigation,
route
  }:Props
){
  const {mutateAsync, isPending} = useMutation({
    mutationFn: REGISTER_USER
  })
    return(
        <LayoutWithScroll>
            <View className="w-full grow pb-10">
                
            <BackButton
    onPress={()=>navigation.goBack()}
/>
            <HeaderText
   weight={700}
   size={20}
   className="text-primary"
   >
   Secure your account
   </HeaderText>
   <NormalText 
size={13}
className="text-white/80">
   Create a new password for your Transferxpress account.
   </NormalText>
   <Formik
   initialValues={{
password:"",
confirmPassword:""
   }}
   onSubmit={async(values)=>{
try {
  const screenParams = route.params;
  await mutateAsync({
    email: screenParams.email,
firstname: screenParams.firstName,
lastname: screenParams.lastName,
country:  screenParams.country,
password: values.confirmPassword,
phoneNumber: screenParams.phoneNumber
  })
  // TODO add toast
  navigation.navigate("login")
} catch (error) {
  return;
}
   }}
   >
   {
    ({values, errors, touched, handleChange, handleBlur, submitForm, dirty})=>{
        const {isPasswordValid, rules} = getPasswordValidationRules(values.password);
const isDisabled = !dirty;
        return(
            <View className="w-full mt-10">
            <View className="w-full mb-4">
            <PasswordInput
    title="Password"
    placeholder="Enter your password"
        onChangeText={handleChange("password")}
    defaultValue={values.password}
    onBlur={handleBlur("password")}
    errorMessage={errors.password}
    touched={touched.password}
    />
             <View className="flex flex-row items-center flex-wrap gap-x-3 gap-y-3 w-full mt-3">
                      {rules.map((condition) => (
                        <View
                          key={condition.title}
                          className="flex flex-row items-center"
                        >
                          {condition.matched ? (
                            <View 
                            style={{
                                width: moderateScale(13, 0.1),
                                height: moderateVerticalScale(13, 0.1)
                            }}
                            className="rounded-full p-[1px] mr-1 bg-[#1DA01D]">
                              <CheckMarkIcon
                                width={"100%"}
                                height={"100%"}
                                fill={"#fff"}
                              />
                            </View>
                          ) : (
                            <View className="w-[12px] h-[12px] rounded-full p-[1px] mr-1 bg-[#D80707]">
                              <XmarkIcon
                                width={"100%"}
                                height={"100%"}
                                fill={"white"}
                              />
                            </View>
                          )}

                          <NormalText className="text-center text-white text-[13px]">
                            {condition.title}
                          </NormalText>
                        </View>
                      ))}
                    </View>
            </View>
            <View className="w-full mb-4">
            <PasswordInput
    title="Confirm Password"
    placeholder="Confirm your password"
    onChangeText={handleChange("confirmPassword")}
    defaultValue={values.confirmPassword}
    onBlur={handleBlur("confirmPassword")}
    errorMessage={errors.confirmPassword}
    touched={touched.confirmPassword}
    />
            </View>
    
            <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
    <ButtonNormal 
    disabled={isDisabled}
    onPress={()=>submitForm()}
    className="w-full bg-secondary">

        {
    !isPending ? (
        <NormalText weight={500} className="text-primary/80">
               Proceed
    </NormalText>
    ) : (
        <Spinner
        circumfrence={80} strokeWidth={3}
        />
    )
  }
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