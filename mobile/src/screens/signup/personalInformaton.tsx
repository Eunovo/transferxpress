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
import { ListBottomSheet } from "@/_components/FormComponents/ListBottomSheet";
import { useFetchCountries } from "@/services/queries/useFetchCountries";
import { ScreenLoader } from "@/_components/loader_utils/ScreenLoader";


export default function SignupPersonalInformation (){
    const countries = useFetchCountries();
    const isLoading = !countries.length 
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
        const countryCallingCode = countries.find(item => item.value === values.country)?.callingCode;
        return(
            <View className="w-full mt-10">
            <View className="w-full mb-4">
            <ListBottomSheet
      title="Country"
        required
        placeholder="Select your country"
        searchBarPlaceholder="Search for country"
        fieldValue={values.country}
        options={countries}
        selectItem={(value)=>{
            setFieldValue("country", value.value)
        }}
        isIconBase64
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
{
    countryCallingCode && (
        <CustomTextInput
        title="Phone Number"
        placeholder="Enter your phone number"
        readOnly={!countryCallingCode}
        defaultValue={typeof countryCallingCode === "string" ? `+${countryCallingCode}  ${values.phoneNumber}` : typeof countryCallingCode !== "string" && typeof countryCallingCode !== "undefined" ? `+${countryCallingCode[0]}  ${values.phoneNumber}`: ""}
        onChangeText={(text)=>{
            console.log(text.length);
            
            const isCallingCodeArray = typeof countryCallingCode !== "undefined" && typeof countryCallingCode !== "string"
            if(isCallingCodeArray ? text.length < countryCallingCode[0]?.length + 3 :  text.length < countryCallingCode.length + 3 ) return ;
            const formmatted = typeof countryCallingCode === "string" ? text.replaceAll(`+${countryCallingCode}`, "") : text.replaceAll(`+${countryCallingCode?.[0]}`, "")
            setFieldValue("phoneNumber", formmatted.trim(), true)
        }}
      onFocus={e => console.log(e.nativeEvent.text.length) }
        />
    )
}
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
        {
            isLoading && (
                <ScreenLoader
                opacity={0.6}
                />
            )
        }
        </LayoutWithScroll>
    )
}