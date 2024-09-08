import { BackButton } from "@/_components/Button/BackButton";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { displayFlashbar } from "@/_components/Flashbar/displayFlashbar";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { CurrencyAmountInput } from "@/_components/Transfer/fiat/CurrencyAmountInput";
import { INITIATE_TRANSFER_PROCESS, SUBMIT_PAYIN_INFORMATION } from "@/api/transfer";
import { UserNavigationStack } from "@/navigation/UserStack";
import { DepositNavigationStackType } from "@/navigation/UserStack/DepositStack";
import { useFetchRates } from "@/services/queries/useFetchRates";
import { setDepositState } from "@/store/deposit/slice";
import { useDepositState } from "@/store/deposit/useDepositState";
import { useAppDispatch } from "@/store/hooks";
import { useUserState } from "@/store/user/useUserState";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { useNavigation } from "@react-navigation/native";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
    // const dispatch = useAppDispatch();
    const {activeWallet} = useUserState()
    const {
      amount: recieverAmount,
      currency,
      exchangeRate: exchangeRateFromTransferState,
    } = useDepositState();
    // const [sender, setSender] = useState({
    //   currency,
    //   amount: "",
    // });
    // const editSender = (field: 'amount' | 'currency', value: string) => {
    //   setSender(prev => {
    //     return {
    //       ...prev,
    //       [field]: value,
    //     };
    //   });
    // };
    const [amountToReceive, setAmountToReceive] = useState(recieverAmount
        ? (
            Number(recieverAmount) * Number(exchangeRateFromTransferState)
          ).toFixed(2)
        : '');

    const dispatch = useAppDispatch();
    const ratesQuery = useFetchRates();
    const {wallets} = useUserState();
    const [sender, setSender] = useState({
      currency: currency,
      amount: recieverAmount
        ? (
            Number(recieverAmount) / Number(exchangeRateFromTransferState)
          ).toFixed(2)
        : '',
    });
  
    const editSender = (field: 'amount' | 'currency', value: string) => {
      setSender(prev => {
        return {
          ...prev,
          [field]: value,
        };
      });
    };
    const initiateTransferutation = useMutation({
      mutationFn: INITIATE_TRANSFER_PROCESS,
    });
    const submitPayinInformationMutation = useMutation({
      mutationFn: SUBMIT_PAYIN_INFORMATION,
    });
    const currencyPair = ratesQuery.rates
      ? ratesQuery.rates[sender.currency]
      : null;
    const exchangeRate =
   currencyPair && activeWallet?.ticker
        ? currencyPair?.[activeWallet?.ticker]?.exchangeRate
        : null;
    useEffect(() => {
      if (!exchangeRate) {
        displayFlashbar({
          type: 'danger',
          message: 'Currency pair does not exist',
        });
      }
    }, [exchangeRate, sender.currency, activeWallet?.ticker]);
    console.log(ratesQuery.rates)
    const transferExchangeRate =
      exchangeRate && Number(exchangeRate) < 1
        ? `${
            flagsAndSymbol[sender.currency as keyof typeof flagsAndSymbol]?.symbol
          } ${formatToCurrencyString(1 / Number(exchangeRate), 2)} = ${
            flagsAndSymbol[activeWallet?.ticker as keyof typeof flagsAndSymbol]
              ?.symbol
          } 1`
        : exchangeRate && Number(exchangeRate) > 1
        ? `${
            flagsAndSymbol[sender.currency as keyof typeof flagsAndSymbol]?.symbol
          } 1 = ${
            flagsAndSymbol[activeWallet?.ticker as keyof typeof flagsAndSymbol]
              ?.symbol
          } ${formatToCurrencyString(exchangeRate, 2)}`
        
        :  'N/A';
    const isButtonDisabled =
      !sender.amount || !amountToReceive || transferExchangeRate === 'N/A';
    const isLoading =
      ratesQuery.isPending ||
      initiateTransferutation.isPending ||
      submitPayinInformationMutation.isPending;
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
                const recieveAmount = exchangeRate
                ? (Number(value) * exchangeRate).toFixed(2)
                : 0;
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
                currency: activeWallet?.ticker || "",
                amount: amountToReceive
            }}
            setAmount={value => {
             setAmountToReceive(value)
              if (value) {
                const sendAmount = exchangeRate
                ? (Number(value) / exchangeRate).toFixed(2)
                : 0;
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
     {transferExchangeRate}
            </NormalText>
          </View>
        </View>
        <View
          style={{gap: 16, maxWidth: moderateScale(400, 0.3)}}
          className="pt-[64px] mt-auto w-full mx-auto justify-start">
          <ButtonNormal
            disabled={isButtonDisabled}
            // onPress={() => {
            //   dispatch(
            //     setDepositState({
            //       currency: sender.currency,
            //       amount: sender.amount,
            //       exchangeRate: exchangeRate ? exchangeRate.toString() : '',
            //     }),
            //   );
            //  navigation.navigate("deposit-summary")
            // }}
            onPress={async () => {
              try {
               if(activeWallet?.ticker){
                const initiateTransferResponse =
                await initiateTransferutation.mutateAsync({
                  from: sender.currency,
                  to: activeWallet.ticker,
                });
              const transferId = initiateTransferResponse.data.id;
              const payinKind =
                initiateTransferResponse.data.payinMethods.find(item =>
                  item.kind.includes("BANK_TRANSFER"),
                )?.kind;
              if (payinKind && typeof transferId === 'number') {
                const submitPayinInfoResponse =
                  await submitPayinInformationMutation.mutateAsync({
                    body: {
                      kind: payinKind,
                      walletId: wallets.find(
                        item => item.ticker === sender.currency,
                      )?.id,
                    },
                    transferId,
                  });
                const payoutMethod = submitPayinInfoResponse.data.find(item =>
                  item.kind.includes('BANK_TRANSFER'),
                );
                dispatch(
                  setTransferState({
                    currency: {
                      reciever: receiver.currency,
                      sender: sender.currency,
                    },
                    amount: receiver.amount,
                    exchangeRate: exchangeRate ? exchangeRate.toString() : '',
                    transferId: initiateTransferResponse.data.id,
                    payoutMethod,
                  }),
                );
                goToNextStage();
               }
                }
              } catch (error) {}
            }}
            className="bg-secondary">
            <NormalText className="text-primary/80">Proceed</NormalText>
          </ButtonNormal>
        </View>
      </View>
       </LayoutNormal>
    )
}