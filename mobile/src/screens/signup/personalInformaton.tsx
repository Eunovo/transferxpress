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
import { CountriesListSelect } from "@/_components/FormComponents/CountriesListSelect";


export default function SignupPersonalInformation (){
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
    Create your account
   </HeaderText>
   <NormalText 
size={13}
className="text-white/80">
   Please provide the required details to help us know you better.
   </NormalText>
   <Formik
   initialValues={{
    firstName:"",
    lastName:"",
    country: "",
    phoneNumber:""
   }}
   onSubmit={()=>{}}
   >
   {
    ({values, setFieldValue})=>{
        return(
            <View className="w-full mt-10">
            <View className="w-full mb-4">
             <CountriesListSelect 
             title="Country"
             placeholder="Select your country"
             value={values.country}
             onSelect={(value)=>{
                setFieldValue("country", value)
             }}
             />
            </View>
            <View className="w-full mb-4">
            <CustomTextInput
    title="First Name"
    placeholder="Enter your name"
    
    />
            </View>
            <View className="w-full mb-4">
            <CustomTextInput
    title="Last Name"
    placeholder="Enter your name"
    
    />
            </View>
            <View className="w-full mb-4">
            <CustomTextInput
    title="Phone Number"
    placeholder="Enter your phone number"
    
    />
            </View>
            <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
    <ButtonNormal className="w-full bg-secondary">
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