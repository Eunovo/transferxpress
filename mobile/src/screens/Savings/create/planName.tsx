import { BackButton } from "@/_components/Button/BackButton";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { CustomTextInput } from "@/_components/FormComponents/CustomInput";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { SavingsNavigationStackType } from "@/navigation/UserStack/SavingsStack";
import { useAppDispatch } from "@/store/hooks";
import { setSavingsPlanState } from "@/store/savingsPlan/slice";
import { Formik } from "formik";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface Props {
    navigation: SavingsNavigationStackType
}
export default function PlanName (
    {
navigation
    }:Props
) {
    const dispatch = useAppDispatch();

    return(
        <LayoutNormal>
            <View 
            className="grow pb-10"
            >
       <BackButton
            onPress={() => {
                navigation.goBack()
            }}
          />
          <HeaderText weight={700} size={20} className="text-primary">
           Create a plan
          </HeaderText>
          <NormalText size={13} className="text-white/80 mb-10 max-w-[80%]">
           Give your savings plan a descriptive plan e.g. School Fees, Car fund etc.
          </NormalText>
          <Formik
   initialValues={{
 name:""
   }}
   onSubmit={async(values)=>{
    dispatch(setSavingsPlanState({
        name: values.name
    }))
navigation.navigate("create-plan-amount")
   }}
   >
   {
    ({values, handleBlur, handleChange, errors, touched, submitForm, dirty})=>{
        const isDisabled = !dirty;
        return(
            <View className="w-full grow">
           <View className="w-full mb-4">
            <CustomTextInput
    title="Name"
    placeholder="Name your savings plan"
    onChangeText={handleChange("name")}
defaultValue={values.name}
onBlur={handleBlur("name")}
errorMessage={errors.name}
touched={touched.name}
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
        </LayoutNormal>
    )
}