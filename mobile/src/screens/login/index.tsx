import {  View } from "react-native";
import { LayoutNormal } from "../../_components/layouts/LayoutNormal";
import { NormalText } from "../../_components/Text/NormalText";
import { CustomTextInput } from "@/_components/FormComponents/CustomInput";
import { Formik } from "formik";
import { PasswordInput } from "@/_components/FormComponents/PasswordInput";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { moderateScale } from "react-native-size-matters";
import { CustomPressable } from "@/_components/Button/CustomPressable";
import { HeaderText } from "@/_components/Text/HeaderText";
import { useMutation } from "@tanstack/react-query";
import { LOGIN_USER } from "@/api/auth";
import { AuthNavigationStack } from "@/navigation/AuthStack";
import { Spinner } from "@/_components/loader_utils/Spinner";


interface Props {
    navigation:AuthNavigationStack
}
export default function Login (
    {
navigation
    }:Props
) {
    const {mutateAsync, isPending} = useMutation({
        mutationFn: LOGIN_USER
    })
    return(
<LayoutNormal>
    <View className="pb-10 grow">
<HeaderText 
weight={700}
size={24}
className="text-primary"
>
    Welcome back
</HeaderText>
<NormalText 
size={13}
className="text-white/80">
    Login to continue transacting with<NormalText size={13} className="text-primary"> TransferXpress</NormalText>
</NormalText>

<Formik
initialValues={{
    email:"",
    password:""
}}
onSubmit={ async(values)=>{
try {
    await mutateAsync(values)
} catch (error) {
    return;
}
}}
>
{
    ({values, errors, touched, handleBlur, handleChange, submitForm, dirty})=>{
        const isDisabled = !dirty || isPending;
        return(
            <View className="w-full mt-10">
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
<View className="mt-3">
    <CustomPressable>
        <NormalText 
        weight={500}
        className="text-primary text-sm">
            Forgot Password?
        </NormalText>
    </CustomPressable>
</View>
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
        Login
    </NormalText>
    ) : (
        <Spinner 
        circumfrence={80} strokeWidth={3}
        />
    )
  }
</ButtonNormal>
<CustomPressable
onPress={()=>{
    navigation.navigate("email-verification")
}}
>
<View 
className="flex-wrap flex-row justify-center mt-2"
>
<NormalText 
className="text-white/80">
    Dont have an account?
</NormalText>

<NormalText 
    weight={500}
    className="text-primary ml-1"
    >Sign in</NormalText>

</View>
</CustomPressable>
</View>
</View>
        )
    }
}
</Formik>
    </View>
</LayoutNormal>
    )
}