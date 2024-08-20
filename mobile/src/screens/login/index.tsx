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



export default function Login () {
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
onSubmit={()=>{

}}
>
<View className="w-full mt-10">
<View className="w-full mb-4">
<CustomTextInput 
title="Email"
placeholder="Enter your email"

/>
</View>
<View className="w-full mb-4">
<PasswordInput 
title="Password"
placeholder="Enter your password"
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
<ButtonNormal className="w-full bg-secondary">
    <NormalText weight={500} className="text-primary/80">
        Login
    </NormalText>
</ButtonNormal>
<View 
className="flex-wrap flex-row justify-center mt-2"
>
<NormalText 
className="text-white/80">
    Dont have an account?
</NormalText>
<CustomPressable>
<NormalText 
    weight={500}
    className="text-primary ml-1"
    >Sign in</NormalText>
</CustomPressable>
</View>
</View>
</View>
</Formik>
    </View>
</LayoutNormal>
    )
}