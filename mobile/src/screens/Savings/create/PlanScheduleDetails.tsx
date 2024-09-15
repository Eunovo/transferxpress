import { BackButton } from "@/_components/Button/BackButton";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { DateInput } from "@/_components/FormComponents/DateInput";
import { ListBottomSheet } from "@/_components/FormComponents/ListBottomSheet";
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
export default function PlanSchedule (
    {
navigation
    }:Props
) {
    const dispatch = useAppDispatch()
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
          <HeaderText weight={700} size={18} className="text-primary">
           Plan Schedule
          </HeaderText>
          <NormalText size={13} className="text-white/80 mb-10 max-w-[80%]">
      Please provide the schedule details for your plan
          </NormalText>
          <Formik
          initialValues={{
            lockPeriod: ""
          }}
          onSubmit={(values)=>{
            dispatch(setSavingsPlanState({
                lockPeriod: values.lockPeriod
            }))
             navigation.navigate("create-plan-summary")
          }}
          >
       {
        ({values, setFieldValue, submitForm, dirty})=>{
            const isButtonDisabled = !dirty;
            return(
                <View
                className="grow"
                >
                <View className="w-full mb-4">
                    <ListBottomSheet 
                    title="Lock period"
                    required
                    placeholder="How long do you want to save for"
                    searchBarPlaceholder=""
                    fieldValue={values.lockPeriod}
                    options={[
                        {
                            value: "1 Month"
                        }, 
                        {
                            value: "3 Months"
                        },
                        {
                            value: "6 Months"
                        },
                        {
                            value: "9 Months"
                        },
                        {
                            value: "12 Months"
                        }
                    ]}
                    selectItem={(value)=>{
                        setFieldValue("lockPeriod", value.value)
                    }}
                    hideSearchBar
                    />
                </View>
                <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] my-auto w-full mx-auto justify-start"
                      >
    <ButtonNormal
    disabled={isButtonDisabled}
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