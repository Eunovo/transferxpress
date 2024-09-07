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
    navigation : TransferNavigationStackType
}

export default function TransferSummaryUSDC (
{
navigation
}:Props
){
  

    const currencySymbol = flagsAndSymbol.USDC.symbol;
    const transferFee = 0.5;
    const amount = 500;
    const totalAmountSent = amount + 0.5;
    const address = "tiuertijerjk23490340ij44"
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
            <BackButton
    onPress={ async()=>{

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
            {/* <View
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
            </View> */}
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
                Recipient address
                </NormalText>

            <NormalText
            size={14}
             weight={500}
            className="text-white"
            >
{address}
            </NormalText>
            </View>
        </View>

        <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
 onPress={async()=>{
navigation.navigate("transfer-usdc-success")
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

        </LayoutNormal>
    )
}