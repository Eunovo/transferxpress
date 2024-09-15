import { BackButton } from "@/_components/Button/BackButton";
import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { GET_TRANSFER_DETAILS } from "@/api/transactions";
import { UserNavigationStack, UserStackParam } from "@/navigation/UserStack";
import { flagsAndSymbol } from "@/utils/constants";
import { formatDate } from "@/utils/formatDate";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { getTime } from "@/utils/getTime";
import { RouteProp } from "@react-navigation/native";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import CalendarIcon from "@/assets/icons/calendar.svg"
import { ScreenLoader } from "@/_components/loader_utils/ScreenLoader";
import { ReportTransactionModal } from "@/_components/Transactions/ReportTransactionModal";

interface Props {
    navigation: UserNavigationStack;
    route: RouteProp<UserStackParam, "view-transaction">
}
export default function ViewTransaction (
    {
navigation,
route
    }:Props
) {
    const details = route.params.transaction;
    const date = new Date(parseFloat(details.createdAt)).toDateString();
    const transferDetailsQuery = useQuery({
        queryKey: ["getTransferDetails"],
        queryFn: ()=>GET_TRANSFER_DETAILS(details.transferId)
    });
    const transferDetails = transferDetailsQuery.data?.data;
    const sendingCurrencySymbol = flagsAndSymbol[details.currencyCode].symbol;
    const paymentDestination = transferDetails?.payoutKind.includes("WALLET") && !details.narration.includes("FUNDING") ? `${details.currencyCode} Wallet` : transferDetails?.payoutKind.includes("WALLET") && details.narration.includes("FUNDING") ? `${details.currencyCode} Savings Wallet` : transferDetails?.payoutPaymentDetails.accountNumber;
   const transferStatus = {
"SUCCESS":"Successful",
"FAILED":"Failed",
"PROCESSING": "Processing",
"CANCELLED":"Cancelled"
   };
   const [showReportModal, setShowReportModal] = useState(false)
return (
    <LayoutNormal>
        <View className="w-full grow pb-10">
        <BackButton
           onPress={()=>{
            navigation.goBack()
           }}
           />
            <HeaderText
   weight={700}
   size={18}
   className="text-primary mb-10"
   >
Transaction Details
   </HeaderText>
   <HeaderText
size={20}
className="text-primary text-center mb-2"
>
{sendingCurrencySymbol} {formatToCurrencyString(details.amount, 2)}
</HeaderText>
<View 
style={{
    gap: 4
}}
className="flex-row items-center justify-center mb-10"
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
<View className="w-full bg-dark p-3 border border-secondary rounded-xl mb-6">
    <View
    className="w-full flex-row justify-between border-b border-b-white/20 pb-4 mb-4"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
To
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
   {paymentDestination}
</NormalText>
    </View>

    <View
    className="w-full flex-row justify-between"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Status
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
{transferStatus[transferDetails?.status as keyof typeof transferStatus]}
</NormalText>
    </View>
</View>
<View className="w-full flex-row justify-between bg-dark p-3 border border-secondary rounded-xl mb-6">
<NormalText
                size={14}
                className="text-white/80"
                >
Narration 
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
{details.narration}
</NormalText>
</View>
<View className="w-full bg-dark p-3 border border-secondary rounded-xl">
    <View
    className="w-full flex-row justify-between border-b border-b-white/20 pb-4 mb-4"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Reference
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white w-[50%]"
                >
{details.reference}
</NormalText>
    </View>

    <View
    className="w-full flex-row justify-between"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Fees
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
{sendingCurrencySymbol} {transferDetails?.fee ? formatToCurrencyString(transferDetails.fee, 2) : 0}
</NormalText>
    </View>
</View>
<CustomPressable
         onPress={()=>setShowReportModal(true)}
            style={{
              gap: 8,
            }}
            className="shrink flex-row items-center justify-center px-3 py-3 bg-secondary rounded-xl mt-10">
            <NormalText size={15} weight={500} className="text-primary/80">
            Report transaction
            </NormalText>
          </CustomPressable>
        </View>
        {
              showReportModal && (
                <ReportTransactionModal
                details={details}
                showModal={showReportModal}
                closeModal={()=>setShowReportModal(false)}
                />
              )
            }
        {
            transferDetailsQuery.isPending && <ScreenLoader opacity={0.6} />
        }
    </LayoutNormal>
)
}