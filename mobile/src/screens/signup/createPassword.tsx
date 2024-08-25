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
import { CustomPressable } from "@/_components/Button/CustomPressable";
import ArrowIcon from "@/assets/icons/arrow.svg"


export default function SignupCreatePassword  (){
    return(
        <LayoutWithScroll>
            <View className="w-full grow pb-10">
                
            <CustomPressable
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
   onSubmit={()=>{}}
   >
   {
    ({values})=>{
        const {isPasswordValid, rules} = getPasswordValidationRules(values.password)
        return(
            <View className="w-full mt-10">
            <View className="w-full mb-4">
            <PasswordInput
    title="Password"
    placeholder="Enter your password"
    
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
    
    />
            </View>
    
            <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
    <ButtonNormal className="w-full bg-secondary">
        <NormalText weight={500} className="text-primary/80">
         Proceed
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