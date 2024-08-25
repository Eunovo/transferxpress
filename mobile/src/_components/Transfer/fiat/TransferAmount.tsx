import { NormalText } from "@/_components/Text/NormalText"
import {View } from "react-native"
import { moderateScale } from "react-native-size-matters";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { useState } from "react";
import { CurrencyAmountInput } from "./CurrencyAmountInput";
import { useAppDispatch } from "@/store/hooks";
import { setTransferState } from "@/store/transfer/slice";



interface Props {
    goToNextStage: ()=>void
}
export const TransferAmount = (
    {
goToNextStage
    }:Props
)=>{
    const dispatch = useAppDispatch();
    const [sender, setSender] = useState({
        currency: "NGN",
        amount: ""
    });
    const editSender = (field: "amount" | "currency", value: string) => {
        setSender((prev) => {
          return {
            ...prev,
            [field]: value,
          };
        });
      };
    const [receiver, setReceiver] = useState({
        currency: "KES",
        amount: ""
    });
    const editReceiver = (field: "amount" | "currency", value: string) => {
        setReceiver((prev) => {
          return {
            ...prev,
            [field]: value,
          };
        });
      };
      const exchangeRate = 0.123;
    return(
      <View>

<View
style={{
    gap: 24
}}
className="w-full"
        >
 <CurrencyAmountInput
 title="Amount to send"
 active={sender}
 setAmount={(value) => {
    editSender("amount", value);
    if (value) {
      const recieveAmount = (
        Number(value) * exchangeRate
      ).toFixed(2);
      editReceiver("amount", `${recieveAmount}`);
    } else {
      editReceiver("amount", "");
    }
  }}
  setCurrency={(value)=>editSender("currency", value)}
 />
 <CurrencyAmountInput
  title="Recipient to receive"
  active={receiver}
  setAmount={(value) => {
    editReceiver("amount", value);
    if (value) {
      const sendAmount = (Number(value) / exchangeRate).toFixed(
        2
      );
      editSender("amount", `${sendAmount}`);
    } else {
      editSender("amount", "");
    }
  }}
  setCurrency={(value)=>editReceiver("currency", value)}
 />
        </View>

        <View
        style={{
            gap: 12
        }}
        className="w-full p-4 mt-10 border border-secondary rounded-xl">
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
                  weight={600}
            className="text-white"
            >
   1560
            </NormalText>
            </View>
        </View>
        <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
 onPress={()=>{
    dispatch(setTransferState({
        currency: receiver.currency,
        amount: receiver.amount
    }))
    goToNextStage()
 }}
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