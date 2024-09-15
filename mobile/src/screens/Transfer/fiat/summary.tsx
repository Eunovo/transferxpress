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


interface Props {
    navigation: TransferNavigationStackType
}
export default function TransferFiatSummary (
    {
navigation
    }:Props
){
    const {amount, accountName, accountNumber, secondaryUniqueIdentifier, currency, narration, exchangeRate, transferFee} = useTransferState();
    const receiverCurrencySymbol = flagsAndSymbol[currency.reciever as keyof typeof flagsAndSymbol].symbol;
    const senderCurrencySymbol = flagsAndSymbol[currency.sender as keyof typeof flagsAndSymbol].symbol;
    const secondaryUniqueIdentifierTitle = {
        USD: "Routing number",
        EUR: "International Bank Account Number (IBAN)",
        GBP: "Sort code",
        MXN:"CLABE number",
        AUD:"Bank state branch code (BSB)"
       }[currency.reciever];
       const totalAmountSent = parseFloat(amount) + parseFloat(`${transferFee}`);
       const amountToReceive = currency.reciever === currency.sender ? amount : (Number(amount) * Number(exchangeRate)).toFixed(2)
       const transferExchangeRate =    exchangeRate && Number(exchangeRate) < 1
       ? `${
           flagsAndSymbol[currency.sender as keyof typeof flagsAndSymbol]?.symbol
         } ${formatToCurrencyString(1 / Number(exchangeRate), 2)} = ${
           flagsAndSymbol[currency.reciever as keyof typeof flagsAndSymbol]
             ?.symbol
         } 1`
       : `${
           flagsAndSymbol[currency.sender as keyof typeof flagsAndSymbol]?.symbol
         } 1 = ${
           flagsAndSymbol[currency.reciever as keyof typeof flagsAndSymbol]
             ?.symbol
         } ${formatToCurrencyString(exchangeRate, 2)}`;
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
 {senderCurrencySymbol} {formatToCurrencyString(transferFee, 2)}
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
{senderCurrencySymbol} {formatToCurrencyString(totalAmountSent, 2)}
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
{receiverCurrencySymbol} {formatToCurrencyString(amountToReceive, 2)}
            </NormalText>
            </View>
   {
    currency.sender !== currency.reciever && (
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
{transferExchangeRate}
        </NormalText>
        </View>
    )
   }
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
            className="flex-row justify-between items-center"
            >
                <NormalText
                size={14}
                     numberOfLines={2}
              ellipsizeMode="tail"
                className="text-white/80 max-w-[50%]"
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
 onPress={()=>{
navigation.navigate("transfer-fiat-pin")
 }}
       className="bg-secondary" 
        >

        <NormalText 
        weight={500}
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