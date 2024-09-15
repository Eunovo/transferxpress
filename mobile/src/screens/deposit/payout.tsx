import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { View } from "react-native";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import CopyIcon from "@/assets/icons/copy.svg"
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { BackButton } from "@/_components/Button/BackButton";
import { DepositNavigationStackType } from "@/navigation/UserStack/DepositStack";
import { useTransferState } from "@/store/transfer/useTransferState";
import { useUserState } from "@/store/user/useUserState";
import { copyText } from "@/utils/copyText";
import { useMutation, useQuery } from "@tanstack/react-query";
import { CONFIRM_QUOTE, GET_TRANSFER_STATUS } from "@/api/transfer";
import { useEffect, useState } from "react";
import { Spinner } from "@/_components/loader_utils/Spinner";

interface Props {
    navigation: DepositNavigationStackType
};
const REFETCH_TIMEOUT_TIME = 30 * 1000;
const  FIELDS = {
    USD: {
       "Account Number":"0123456789",
        secondaryUniqueIdentifier:"123456780"
    },
    EUR: {
        "Account Number":"0324567891",
        secondaryUniqueIdentifier:"1234567890"
    },
    GBP: {
        "Account Number":"22233344550",
        secondaryUniqueIdentifier:"4235456"
    },
    MXN: {
        "Account Number":"7699403330",
        secondaryUniqueIdentifier:"7980456"
    },
    AUD: {
        "Account Number":"5678903032",
        secondaryUniqueIdentifier:"234467"
    },
    KES:{
        "Account Number":"55553355903",
        secondaryUniqueIdentifier: ""

    },
    NGN: {
        "Account Number":"1000567890", 
        secondaryUniqueIdentifier: ""
    },
    GHS:{
        "Account Number":"555777322221",
        secondaryUniqueIdentifier:""
    }
};
const secondaryUniqueIdentifierTitles = {
    USD: 'Routing number',
    EUR: 'International Bank Account Number (IBAN)',
    GBP: 'Sort code',
    MXN: 'CLABE number',
    AUD: 'Bank state branch code (BSB)',
  };
export default function DepositPayout (
    {
navigation
    }:Props
) {
    const {amount, currency, transferId} = useTransferState();
    const {profile, activeWallet} = useUserState();
    const accountName = profile ? `${profile.firstname} ${profile.lastname} - ${activeWallet?.ticker}` : "";
    const accountNumber = FIELDS[activeWallet?.ticker as keyof typeof FIELDS]["Account Number"];
    const secondaryUniqueIdentifier = FIELDS[activeWallet?.ticker as keyof typeof FIELDS]?.secondaryUniqueIdentifier;
    const secondaryUniqueIdentifierTitle = secondaryUniqueIdentifierTitles[activeWallet?.ticker as keyof typeof secondaryUniqueIdentifierTitles];
    const confirQuoteMutation = useMutation({
        mutationFn: CONFIRM_QUOTE
       });
       const [refetchInterval, setRefetchIntervall] = useState(10000)
       const transferStatusQuery = useQuery({
        queryKey: ["getTransferStatus"],
        queryFn: ()=>GET_TRANSFER_STATUS(transferId!),
        enabled: confirQuoteMutation.isSuccess,
         staleTime: 0,        
        refetchInterval
       });
       const transferStatus = transferStatusQuery.data?.data.status;
       useEffect(
        ()=>{
    if(transferStatusQuery.isSuccess && transferStatus === "SUCCESS" ){
    navigation.navigate("deposit-success")
    }
        }, [transferStatusQuery.isSuccess, transferStatusQuery.isRefetching]
       )
       useEffect(
        ()=>{
    if(transferStatusQuery.isSuccess){
    const refetchTimeout = setTimeout(
    ()=>{
    setRefetchIntervall(0)
    navigation.navigate("deposit-success")
    }, REFETCH_TIMEOUT_TIME
    )
    return ()=>{
    clearTimeout(refetchTimeout)
    }
    }
        }, [transferStatusQuery.isSuccess]
       );
    
       const isLoading = confirQuoteMutation.isPending || transferStatusQuery.isFetching;
       const isDisabled =  confirQuoteMutation.isPending || transferStatusQuery.isFetching;
    return(
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
   className="text-primary"
   >
Deposit money
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
Transfer to account details below
   </NormalText>
   <View 
   style={{
    gap: 40
   }}
   className="w-full p-4 bg-dark border border-secondary rounded-xl"
   >
<View
style={{
    gap: 4
}}
className="items-center pb-4 border-b border-secondary"
>
    <NormalText
    size={12}
    className="text-white/80"
    >
        Amount to send
    </NormalText>
    <HeaderText
    size={20}
    weight={600}
    className="text-primary"
    >
        {flagsAndSymbol[currency.sender as keyof typeof flagsAndSymbol].symbol} {formatToCurrencyString(amount, 2)}
    </HeaderText>
</View>

<View
className="w-full flex-row items-center justify-between"
>
<NormalText
className="text-white/80"
>
    Account Number
</NormalText>
<View 
style={{
    gap: 8
}}
className="flex-row items-center">
<NormalText
weight={500}
className="text-white"
>
{accountNumber}
</NormalText>
<CustomPressable
onPress={()=>{
    copyText(accountNumber)
}}
>
<CopyIcon
fill={"#ECB365"}
fillOpacity={0.6}
width={moderateScale(16, 0.1)}
height={moderateVerticalScale(16, 0.1)}
/>
</CustomPressable>
</View>
</View>

{
    secondaryUniqueIdentifier && (
        <View
className="w-full flex-row items-center justify-between"
>
<NormalText
className="text-white/80 max-w-[50%]"
>
   {secondaryUniqueIdentifierTitle}
</NormalText>
<View 
style={{
    gap: 8
}}
className="flex-row items-center">
<NormalText
weight={500}
className="text-white"
>
{secondaryUniqueIdentifier}
</NormalText>
<CustomPressable
onPress={()=>{
copyText(secondaryUniqueIdentifier)
}}
>
<CopyIcon
fill={"#ECB365"}
fillOpacity={0.6}
width={moderateScale(16, 0.1)}
height={moderateVerticalScale(16, 0.1)}
/>
</CustomPressable>
</View>
</View>
    )
}
   </View>

   <View
                    style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                    className="pt-[64px] mt-auto w-full mx-auto justify-start"
                  >
<ButtonNormal 
disabled={isDisabled}
onPress={async()=>{
    try {
        if(transferId){
            await confirQuoteMutation.mutateAsync(transferId);
            navigation.navigate("deposit-success")
        }
    } catch (error) {
        
    }

}}
className="w-full bg-secondary">
    {
    !isLoading ? (
        <NormalText weight={500} className="text-primary/80">
     I have sent the money
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
             navigation.goBack()
             }}
>
<View 
className="flex-wrap flex-row justify-center mt-2"
>
<NormalText 
weight={500}
className="text-white/80">
   Cancel Transfer
</NormalText>

</View>
</CustomPressable>
</View>
   </View>
   </LayoutNormal>
    )
}
