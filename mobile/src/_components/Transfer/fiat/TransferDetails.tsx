import { ButtonNormal } from "@/_components/Button/NormalButton"
import { CustomTextInput } from "@/_components/FormComponents/CustomInput"
import { NormalText } from "@/_components/Text/NormalText"
import { TransferNavigationStackType } from "@/navigation/UserStack/TransferStack"
import { useAppDispatch } from "@/store/hooks"
import { setTransferState } from "@/store/transfer/slice"
import { useTransferState } from "@/store/transfer/useTransferState"
import { useNavigation } from "@react-navigation/native"
import { Formik } from "formik"
import { View } from "react-native"
import { moderateScale } from "react-native-size-matters"

export const TransferDetails = ()=>{
    const initialState = useTransferState();
    const navigation = useNavigation<TransferNavigationStackType>()
    const dispatch = useAppDispatch()
    const secondaryUniqueIdentifierTitle = {
     USD: "Routing number",
     EUR: "International Bank Account Number (IBAN)",
     GBP: "Sort code",
     MXN:"CLABE number",
     AUD:"Bank state branch code (BSB)"
    }[initialState.currency.reciever];
    const secondaryUniqueIdentifierMaxLength = {
        USD: 9,
        EUR: 34,
        GBP: 6,
        MXN:18,
        AUD:6
       }[initialState.currency.reciever];
    return(
 <Formik
 initialValues={{
    accountName: initialState.accountName,
    accountNumber: initialState.accountNumber,
    secondaryUniqueIdentifier: initialState.secondaryUniqueIdentifier || "",
    narration: initialState.narration
 }}
 onSubmit={(values)=>{
    dispatch(setTransferState(values))
    navigation.navigate("transfer-fiat-summary")
 }}
 >
           {
            ({values, submitForm, touched, errors, handleBlur, setFieldValue, dirty})=>{
                const isButtonDisabled = !dirty;
                return(
                    <View className="w-full">
<View className="w-full mb-6">
<CustomTextInput 
title="Account name"
placeholder="Enter account name"
onChangeText={(text)=>{
    setFieldValue("accountName", text, true)
}}
defaultValue={values.accountName}
onBlur={handleBlur("accountName")}
errorMessage={errors.accountName}
touched={touched.accountName}
maxLength={50}
/>
</View>
<View className="w-full mb-6">
<CustomTextInput 
title="Account number"
placeholder="Enter account number"
onEndEditing={(e) => {
    const text = e.nativeEvent.text;
    if (text) {
      const formatted = text.replace(/[^0-9]/g, "");
      setFieldValue("accountNumber", formatted);
    }
  }}
defaultValue={values.accountNumber}
onBlur={handleBlur("accountNumber")}
errorMessage={errors.accountNumber}
touched={touched.accountNumber}
maxLength={10}
keyboardType="number-pad"
/>
</View>
{
    secondaryUniqueIdentifierTitle && (
        <View className="w-full mb-6">
<CustomTextInput 
title={secondaryUniqueIdentifierTitle}
placeholder={"Enter " + secondaryUniqueIdentifierTitle}
onChangeText={(text)=>{
    setFieldValue("secondaryUniqueIdentifier", text, true)
}}
defaultValue={values.secondaryUniqueIdentifier}
onBlur={handleBlur("secondaryUniqueIdentifier")}
errorMessage={errors.secondaryUniqueIdentifier}
touched={touched.secondaryUniqueIdentifier}
maxLength={secondaryUniqueIdentifierMaxLength}
/>
</View>
    )
}
<View className="w-full mb-6">
<CustomTextInput 
title="Narration"
placeholder="Enter narration"
onChangeText={(text)=>{
    setFieldValue("narration", text, true)
}}
defaultValue={values.narration}
onBlur={handleBlur("narration")}
errorMessage={errors.narration}
touched={touched.narration}
maxLength={50}
/>
</View>
<View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
 disabled={isButtonDisabled}
 onPress={()=>submitForm()}
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