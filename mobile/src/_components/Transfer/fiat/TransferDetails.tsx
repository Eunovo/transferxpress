import { ButtonNormal } from "@/_components/Button/NormalButton"
import { CustomTextInput } from "@/_components/FormComponents/CustomInput"
import { NormalText } from "@/_components/Text/NormalText"
import { Formik } from "formik"
import { View } from "react-native"
import { moderateScale } from "react-native-size-matters"

export const TransferDetails = ()=>{
    const secondaryUniqueNumberTitle = {
     USD: "Routing number",
     EUR: "International Bank Account Number",
     GBP: "Sort code",
     MXN:"CLABE number",
     AUD:"Bank state branch code (BSB)"
    }
    return(
 <Formik
 initialValues={{
    accountName: "",
    accountNumber:"",
    secondaryUniqueNumber:""
 }}
 onSubmit={()=>{}}
 >
           {
            ({values})=>{
                return(
                    <View className="w-full">
<View className="w-full mb-6">
<CustomTextInput 
title="Account name"
placeholder="Enter account name"
/>
</View>
<View className="w-full mb-6">
<CustomTextInput 
title="Account number"
placeholder="Enter account number"
/>
</View>
<View className="w-full mb-6">
<CustomTextInput 
title="Account number"
placeholder="Enter account number"
/>
</View>
<View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
       className="bg-secondary" 
        >
            <NormalText
            className="text-primary/80"
            >
                Proceed
            </NormalText>
        </ButtonNormal>
 </View>

        </View>
                )
            }
           }
 </Formik>
    )
}