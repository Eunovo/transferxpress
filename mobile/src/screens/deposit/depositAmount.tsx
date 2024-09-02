import { BackButton } from "@/_components/Button/BackButton";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { CurrencyAmountInput } from "@/_components/Transfer/fiat/CurrencyAmountInput";
import { UserNavigationStack } from "@/navigation/UserStack";
import { DepositNavigationStackType } from "@/navigation/UserStack/DepositStack";
import { setDepositState } from "@/store/deposit/slice";
import { useDepositState } from "@/store/deposit/useDepositState";
import { useAppDispatch } from "@/store/hooks";
import { useUserState } from "@/store/user/useUserState";
import { flagsAndSymbol } from "@/utils/constants";
import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";

interface Props {
    navigation:DepositNavigationStackType
}
export const DepositAmount = (
    {
navigation
    }:Props
)=>{
    const userStackNavigation = useNavigation<UserNavigationStack>()
    const dispatch = useAppDispatch();
    const {activeWallet} = useUserState()
    const {
      amount: recieverAmount,
      currency,
      exchangeRate: exchangeRateFromTransferState,
    } = useDepositState();
    const [sender, setSender] = useState({
      currency,
      amount: "",
    });
    const editSender = (field: 'amount' | 'currency', value: string) => {
      setSender(prev => {
        return {
          ...prev,
          [field]: value,
        };
      });
    };
    const [amountToReceive, setAmountToReceive] = useState(recieverAmount
        ? (
            Number(recieverAmount) * Number(exchangeRateFromTransferState)
          ).toFixed(2)
        : '');
    const exchangeRate = 0.009;
    const isButtonDisabled = !sender.amount || !amountToReceive;
    return(
       <LayoutNormal>
         <View className="grow w-full pb-10">
                <BackButton
           onPress={()=>{    
          userStackNavigation.navigate("main-bottom-tab")
           }}
           />
            <HeaderText
   weight={700}
   size={20}
   className="text-primary"
   >
   Receive money
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
 How much do you want to deposit?
   </NormalText>
        <View
          style={{
            gap: 24,
          }}
          className="w-full">
          <CurrencyAmountInput
            title="Amount to send"
            active={sender}
            setAmount={value => {
              editSender('amount', value);
              if (value) {
                const recieveAmount = (Number(value) * exchangeRate).toFixed(2);
                setAmountToReceive(`${recieveAmount}`);
              } else {
            setAmountToReceive("")
              }
            }}
            setCurrency={value => editSender('currency', value)}
          />
          <CurrencyAmountInput
          isReadOnly
            title="Wallet to receive"
            active={{
                currency: activeWallet?.ticker,
                amount: amountToReceive
            }}
            setAmount={value => {
             setAmountToReceive(value)
              if (value) {
                const sendAmount = (Number(value) / exchangeRate).toFixed(2);
                editSender('amount', `${sendAmount}`);
              } else {
                editSender('amount', '');
              }
            }}
            setCurrency={() => {}}
          />
        </View>
  
        <View
          style={{
            gap: 12,
          }}
          className="w-full p-4 mt-10 border border-secondary rounded-xl">
          <View className="flex-row justify-between">
            <NormalText size={14} className="text-white/80">
              Exchange rate
            </NormalText>
  
            <NormalText size={14} weight={600} className="text-white">
              {
                flagsAndSymbol[activeWallet?.ticker as keyof typeof flagsAndSymbol]
                  .symbol
              }{' '}
              {exchangeRate ? (1 / exchangeRate).toFixed(4) : 0}
            </NormalText>
          </View>
        </View>
        <View
          style={{gap: 16, maxWidth: moderateScale(400, 0.3)}}
          className="pt-[64px] mt-auto w-full mx-auto justify-start">
          <ButtonNormal
            disabled={isButtonDisabled}
            onPress={() => {
              dispatch(
                setDepositState({
                  currency: sender.currency,
                  amount: sender.amount,
                  exchangeRate: exchangeRate.toString(),
                }),
              );
             navigation.navigate("deposit-summary")
            }}
            className="bg-secondary">
            <NormalText className="text-primary/80">Proceed</NormalText>
          </ButtonNormal>
        </View>
      </View>
       </LayoutNormal>
    )
}