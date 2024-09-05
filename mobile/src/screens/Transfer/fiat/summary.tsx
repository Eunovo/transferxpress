import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { View } from "react-native";
import { moderateScale} from "react-native-size-matters";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { useTransferState } from "@/store/transfer/useTransferState";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { TransferNavigationStackType } from "@/navigation/UserStack/TransferStack";
import { BackButton } from "@/_components/Button/BackButton";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CANCEL_QUOTE, CONFIRM_QUOTE, GET_TRANSFER_STATUS } from "@/api/transfer";
import { useEffect, useState } from "react";
import { ScreenLoader } from "@/_components/loader_utils/ScreenLoader";

interface Props {
    navigation: TransferNavigationStackType
}
const REFETCH_TIMEOUT_TIME = 30 * 1000;
export default function TransferFiatSummary (
    {
navigation
    }:Props
){
    const {amount, accountName, accountNumber, secondaryUniqueIdentifier, currency, narration, exchangeRate, transferId, transferFee} = useTransferState();

    const currencySymbol = flagsAndSymbol[currency.reciever as keyof typeof flagsAndSymbol].symbol;
    const secondaryUniqueIdentifierTitle = {
        USD: "Routing number",
        EUR: "International Bank Account Number (IBAN)",
        GBP: "Sort code",
        MXN:"CLABE number",
        AUD:"Bank state branch code (BSB)"
       }[currency.reciever];
       const confirQuoteMutation = useMutation({
        mutationFn: CONFIRM_QUOTE
       });
       const cancelQuoteMutation = useMutation({
        mutationFn: CANCEL_QUOTE
       });
       const [refetchInterval, setRefetchIntervall] = useState(10000)
       const transferStatusQuery = useQuery({
        queryKey: ["getTransferStatus"],
        queryFn: ()=>GET_TRANSFER_STATUS(transferId!),
        enabled: confirQuoteMutation.isSuccess,
        refetchInterval
       });
       const transferStatus = transferStatusQuery.data?.data.status;
       useEffect(
        ()=>{
if(transferStatusQuery.isSuccess && transferStatus === "SUCCESS"){
    navigation.navigate("transfer-fiat-success")
}
        }, [transferStatusQuery.isSuccess, transferStatusQuery.isRefetching]
       )
       useEffect(
        ()=>{
if(transferStatusQuery.isSuccess){
 const refetchTimeout = setTimeout(
    ()=>{
setRefetchIntervall(0)
navigation.navigate("transfer-fiat-success")
    }, REFETCH_TIMEOUT_TIME
)
return ()=>{
    clearTimeout(refetchTimeout)
}
}
        }, [transferStatusQuery.isSuccess]
       );

       const isLaoding = confirQuoteMutation.isPending || transferStatusQuery.isFetching;
       const totalAmountSent = parseFloat(amount) + parseFloat(`${transferFee}`);
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
            <BackButton
    onPress={ async()=>{
   try {
    if(confirQuoteMutation.isSuccess && transferId){
       await cancelQuoteMutation.mutateAsync(transferId)
    }
    navigation.goBack()
   } catch (error) {
    
   }
    }}
/>
            <HeaderText
   weight={700}
   size={20}
   className="text-primary"
   >
 Transaction Review
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
Confirm the details of your transaction
   </NormalText>
   <View
        style={{
            gap: 12
        }}
        className="w-full p-4 border border-secondary rounded-xl">
            <HeaderText
className="text-primary"
>
 Transaction Information
</HeaderText>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
                   Fees
                </NormalText>

            <NormalText
            size={14}
          weight={500}
            className="text-white"
            >
 {currencySymbol} {formatToCurrencyString(transferFee, 2)}
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
               Amount to send
                </NormalText>

            <NormalText
            size={14}
            weight={500}
            className="text-white"
            >
{currencySymbol} {formatToCurrencyString(totalAmountSent, 2)}
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
                  Recipient will recieve
                </NormalText>

            <NormalText
            size={14}
        weight={500}
            className="text-white"
            >
{currencySymbol} {formatToCurrencyString(amount, 2)}
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
                   Exchange rate
                </NormalText>

            <NormalText
            size={14}
         weight={500}
            className="text-white"
            >
 {currencySymbol} {exchangeRate ? (1 / Number(exchangeRate)).toFixed(4) : 0}
            </NormalText>
            </View>
            <View  className="w-full border-t border-white/20 my-4"/>
<HeaderText
className="text-primary"
>
    Recipient Information
</HeaderText>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
                Recipient name
                </NormalText>

            <NormalText
            size={14}
             weight={500}
            className="text-white"
            >
{accountName}
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
            className="text-white/80"
                >
               Recipient account 
                </NormalText>

            <NormalText
            size={14}
       weight={500}
            className="text-white"
            >
{accountNumber}
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
     {secondaryUniqueIdentifierTitle}
                </NormalText>

            <NormalText
            size={14}
            className="text-white/80"
            >
{secondaryUniqueIdentifier}
            </NormalText>
            </View>
            <View
            className="flex-row justify-between"
            >
                <NormalText
                size={14}
                className="text-white/80"
                >
  Narration
                </NormalText>

            <NormalText
            size={14}
    weight={500}
            className="text-white capitalize"
            >
{narration}
            </NormalText>
            </View>
        </View>

        <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
 onPress={async()=>{
if(transferId){
    try {
        await confirQuoteMutation.mutateAsync(transferId)
    } catch (error) {
        
    }
}
 }}
       className="bg-secondary" 
        >
            <NormalText 
            className="text-primary/80"
            >
                Confirm and Proceed
            </NormalText>
        </ButtonNormal>
 </View>
            </View>
            {
          isLaoding && (
                <ScreenLoader
                opacity={0.6}
                />
            )
        }
        </LayoutNormal>
    )
}