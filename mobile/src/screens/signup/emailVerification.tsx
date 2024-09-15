import { View } from "react-native";
import { LayoutWithScroll } from "../../_components/layouts/LayoutWithScroll";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { Formik } from "formik";
import { CustomTextInput } from "@/_components/FormComponents/CustomInput";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { moderateScale } from "react-native-size-matters";
import { AuthNavigationStack} from "@/navigation/AuthStack";
import { useMutation } from "@tanstack/react-query";
import { VERIFY_EMAIL } from "@/api/auth";
import { BackButton } from "@/_components/Button/BackButton";
import { Spinner } from "@/_components/loader_utils/Spinner";
import { displayFlashbar } from "@/_components/Flashbar/displayFlashbar";
import * as yup from "yup"


interface Props {
    navigation:AuthNavigationStack;
};
const validationSchema = yup.object({
    email: yup
      .string()
      .email("Please enter a valid email")
      .test("test-email", "Please enter a valid email", function (value) {
        const regex = /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$/;
        if (value) {
          return regex.test(value);
        }
      })
      .required("Please enter your email address"),
    });
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
            <View 
              style={{
                paddingTop: moderateScale(40, 0.1)
            }}
            className="w-full grow pb-10">
            <BackButton
    onPress={()=>navigation.goBack()}
/>
   <HeaderText
   weight={700}
   size={20}
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
   validationSchema={validationSchema}
   onSubmit={async(values)=>{
    try {
      const res =  await mutateAsync(values);
      const emailStatus = res.data.status;
      if(emailStatus === "AVAILABLE"){
      return  navigation.navigate("personal-info", values)
      }
       else{
        return displayFlashbar({
            type: "danger",
            message: "Account already exists"
        })
       }
    } catch (error) {
        return;
    }
   }}
   >
   {
    ({values, handleBlur, handleChange, errors, touched, submitForm, dirty, isValid})=>{
        const isDisabled = !dirty || isPending || !isValid;
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
                        className="pt-[64px] my-auto w-full mx-auto justify-start"
                      >
    <ButtonNormal 
    disabled={isDisabled}
    onPress={()=> submitForm()}
    className="w-full bg-secondary">
        {
    !isPending ? (
        <NormalText weight={500} className="text-primary/80">
       Next
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