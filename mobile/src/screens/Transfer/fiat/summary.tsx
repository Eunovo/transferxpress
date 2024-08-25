import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { View } from "react-native";
import ArrowIcon from "@/assets/icons/arrow.svg"
import { CustomPressable } from "@/_components/Button/CustomPressable";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { useTransferState } from "@/store/transfer/useTransferState";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { TransferNavigationStackType } from "@/navigation/UserStack/TransferStack";

interface Props {
    navigation: TransferNavigationStackType
}
export default function TransferFiatSummary (
    {
navigation
    }:Props
){
    const {amount, accountName, accountNumber, secondaryUniqueIdentifier, currency, narration} = useTransferState();
    const currencySybol = flagsAndSymbol[currency as keyof typeof flagsAndSymbol].symbol;
    const secondaryUniqueIdentifierTitle = {
        USD: "Routing number",
        EUR: "International Bank Account Number (IBAN)",
        GBP: "Sort code",
        MXN:"CLABE number",
        AUD:"Bank state branch code (BSB)"
       }[currency];
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
            <CustomPressable
            onPress={()=>navigation.goBack()}
                style={{
                    width: moderateScale(40, 0.3),
                    height: moderateVerticalScale(40, 0.3)
                }}
                className="rounded-full bg-primary items-center justify-center mb-4"
                >
                    <ArrowIcon
                  fill={"#04293A"}
                  width={moderateScale(20, 0.3)}
                  height={moderateVerticalScale(20, 0.3)}
                    />
                </CustomPressable>
            <HeaderText
   weight={700}
   size={24}
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
 0.5
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
{currencySybol} {formatToCurrencyString(amount, 2)}
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
800000
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
   1560
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
 onPress={()=>navigation.navigate("transfer-fiat-payout")}
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