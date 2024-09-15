import { View } from "react-native"
import RNModal from "react-native-modal";
import { HeaderText } from "../Text/HeaderText";
import { CustomPressable } from "../Button/CustomPressable";
import { moderateScale } from "react-native-size-matters";
import { flagsAndSymbol, SCREEN_HEIGHT } from "@/utils/constants";
import XmarkIcon from "@/assets/icons/x_mark.svg";
import { NormalText } from "../Text/NormalText";
import { REPORT_TRANSACTION, Transaction } from "@/api/transactions";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import CalendarIcon from "@/assets/icons/calendar.svg"
import { getTime } from "@/utils/getTime";
import { formatDate } from "@/utils/formatDate";
import { ListBottomSheet } from "../FormComponents/ListBottomSheet";
import { Formik } from "formik";
import { CustomTextArea } from "../FormComponents/CustomTextArea";
import { ButtonNormal } from "../Button/NormalButton";
import { Spinner } from "../loader_utils/Spinner";
import { useMutation } from "@tanstack/react-query";
import { displayFlashbar } from "../Flashbar/displayFlashbar";



interface Props {
    details: Transaction;
showModal: boolean;
closeModal: ()=>void
}
export const ReportTransactionModal = (
    {
showModal,
closeModal,
details
    }:Props
)=>{
    const reportTransactionMutation = useMutation({
        mutationFn: REPORT_TRANSACTION
    })
    const date = new Date(parseFloat(details.createdAt)).toDateString();
    const reasons = [
        {
            id:"AMOUNT_MISMATCHH",
            value:"Amount Mismatch"
        },
        {
            id: "TRANSACTION_DELAYED",
            value:"Transaction Delay"
        },
        {
            id: "COMPLETED_WITHOUT_SETTLEMENT",
            value:"Money not received"
        },
        {
            id: "OTHER",
            value:"Other"
        }
    ];
    return(
        <RNModal
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
        isVisible={showModal}
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        backdropOpacity={0.5}
        backdropColor="#101010"
        deviceHeight={SCREEN_HEIGHT}
        onBackdropPress={() => closeModal()}
        swipeDirection={"down"}
        onSwipeComplete={closeModal}
        statusBarTranslucent
      >
        <View
          style={{ flex: 1 }}
          className="bg-background rounded-t-xl px-6 py-8 max-h-[90%]"
        >
                  <View className="items-center flex-row justify-between mb-10">
      <HeaderText size={18} weight={600} className="text-primary my-4">
       Report Transaction?
              </HeaderText>
      <CustomPressable
                onPress={closeModal}
                style={{
                    width: moderateScale(40, 0.1),
                    height: moderateScale(40, 0.1)
                }}
                className="ml-auto bg-dark border border-secondary rounded-full items-center justify-center"
              >
                <XmarkIcon width={24} height={24} fill="#ECB365" />
              </CustomPressable>
      </View>
      <View>
        <NormalText
        className="text-white/80 mb-2"
        >
            Report an issue or share feedback regarding this transaction
        </NormalText>
        <View className="w-full bg-dark p-3 border border-secondary rounded-xl mb-10">
            <HeaderText
            weight={600}
            className="text-primary"
            >
               {flagsAndSymbol[details.currencyCode].symbol} {formatToCurrencyString(details.amount, 2)}
            </HeaderText>
            <NormalText
            className="text-white/80 my-1"
            >
                {details.narration}
            </NormalText>
            <View 
style={{
    gap: 4
}}
className="flex-row items-center"
>
<CalendarIcon 
width={moderateScale(14)}
height={moderateScale(14)}
/>
<NormalText
size={13}
className="text-white/80">
{getTime(details.createdAt)} . {formatDate(date)}
   </NormalText>
</View>

            </View>
<Formik
initialValues={{
    reason:"",
    message: ""
}}
onSubmit={async(values)=>{
try {
    const failureReason = reasons.find(item => item.value === values.reason)?.id || "";
    await reportTransactionMutation.mutateAsync({
        transferId: details.transferId,
        body: {
            reason: failureReason,
            other: values.message
        }
    });
    displayFlashbar({
        type: "success",
        message: "Report submitted"
    })
    closeModal()
} catch (error) {
    
}
}}
>
    {
        ({values, setFieldValue, touched, errors, handleBlur, submitForm})=>{
            const isDisabled = !values.reason || reportTransactionMutation.isPending;
            return(
             <View>
                            <View className="w-full mb-4">
<ListBottomSheet 
  title="Reasons"
  required
  placeholder="Select reason"
  searchBarPlaceholder=""
  fieldValue={values.reason}
  options={reasons}
  selectItem={(value)=>{
      setFieldValue("reason", value.value)
  }}
  hideSearchBar
/>
            </View>
<View
className="w-full mb-4"
>
<CustomTextArea 
     title="Message"
     onChangeText={(text) => {
       setFieldValue("message", text);
     }}
     placeholder="Enter your message"
     value={values.message}
     onBlur={handleBlur("message")}
     touched={touched.message}
     maxLength={150}
     height={100}
     multiline
     numberOfLines={4}
     errorMessage={errors.message}
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
    !reportTransactionMutation.isPending ? (
        <NormalText weight={500} className="text-primary/80">
      Submit report
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
</View>
</RNModal>
    )
}