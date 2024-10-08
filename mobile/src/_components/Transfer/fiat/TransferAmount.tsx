import {NormalText} from '@/_components/Text/NormalText';
import {View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {ButtonNormal} from '@/_components/Button/NormalButton';
import {useEffect, useState} from 'react';
import {CurrencyAmountInput} from './CurrencyAmountInput';
import {useAppDispatch} from '@/store/hooks';
import {setTransferState} from '@/store/transfer/slice';
import {flagsAndSymbol} from '@/utils/constants';
import {useTransferState} from '@/store/transfer/useTransferState';
import {useFetchRates} from '@/services/queries/useFetchRates';
import {ScreenLoader} from '@/_components/loader_utils/ScreenLoader';
import {useMutation} from '@tanstack/react-query';
import {
  INITIATE_TRANSFER_PROCESS,
  SUBMIT_PAYIN_INFORMATION,
} from '@/api/transfer';
import {useUserState} from '@/store/user/useUserState';
import {formatToCurrencyString} from '@/utils/formatToCurrencyString';
import {displayFlashbar} from '@/_components/Flashbar/displayFlashbar';
import { Currencies } from '@/api/rates';

interface Props {
  goToNextStage: () => void;
}
export const TransferAmount = ({goToNextStage}: Props) => {
  const dispatch = useAppDispatch();
  const ratesQuery = useFetchRates();
  const {wallets} = useUserState();
  const {
    amount: senderAmount,
    currency,
    exchangeRate: exchangeRateFromTransferState,
  } = useTransferState();
  const [sender, setSender] = useState({
    currency: currency.sender,
    amount: senderAmount,
  });

  const editSender = (field: 'amount' | 'currency', value: string) => {
    setSender(prev => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  const [receiver, setReceiver] = useState({
    currency: currency.reciever,
    amount: senderAmount
    ? (
        Number(senderAmount) / Number(exchangeRateFromTransferState)
      ).toFixed(2)
    : '',
  });
  const editReceiver = (field: 'amount' | 'currency', value: string) => {
    setReceiver(prev => {
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
  const supportedCurrencyPair = sender.currency && ratesQuery.rates ? ratesQuery.rates[sender.currency as Currencies] : undefined;
  const supportedCurrencies =  wallets.filter(item => item.ticker !== "BTC" && item.ticker !== "USDC").map(item => item.ticker);
  const exchangeRate =  supportedCurrencyPair && receiver.currency ?  supportedCurrencyPair[receiver.currency as Currencies]?.exchangeRate  : null;

  useEffect(() => {
  if(exchangeRate && !ratesQuery.isPending){
    editSender('amount', '');
    editReceiver("amount", "");
  }
    if(!exchangeRate && !ratesQuery.isPending && sender.currency !== receiver.currency){
      displayFlashbar({
          type: "danger",
          message: "Sorry currency pair not supported"
      })
    }
  }, [exchangeRate, ratesQuery.isPending, sender.currency, receiver.currency]);
  const transferExchangeRate =
    exchangeRate && Number(exchangeRate) < 1
      ? `${
          flagsAndSymbol[sender.currency as keyof typeof flagsAndSymbol]?.symbol
        } ${formatToCurrencyString(1 / Number(exchangeRate), 2)} = ${
          flagsAndSymbol[receiver.currency as keyof typeof flagsAndSymbol]
            ?.symbol
        } 1`
      : exchangeRate && Number(exchangeRate) > 1
      ? `${
          flagsAndSymbol[sender.currency as keyof typeof flagsAndSymbol]?.symbol
        } 1 = ${
          flagsAndSymbol[receiver.currency as keyof typeof flagsAndSymbol]
            ?.symbol
        } ${formatToCurrencyString(exchangeRate, 2)}`
      
      :  'N/A';
  const isButtonDisabled =
    !sender.amount || !receiver.amount;
  const isLoading =
    ratesQuery.isPending ||
    initiateTransferutation.isPending ||
    submitPayinInformationMutation.isPending;

  return (
    <>
      <View>
        <View
          style={{
            gap: 24,
          }}
          className="w-full">
          <CurrencyAmountInput
            title="Send"
            active={sender}
            supportedCurrencies={supportedCurrencies}
            setAmount={value => {
              editSender('amount', value);
              if (value) {
                const recieveAmount = exchangeRate
                  ? (Number(value) * exchangeRate).toFixed(2)
                  : 0;
                editReceiver('amount', `${recieveAmount}`);
              } else {
                editReceiver('amount', '');
              }
            }}
            setCurrency={value => editSender('currency', value)}
            showBalance
          />

{
  sender.currency !== receiver.currency && (
    <CurrencyAmountInput
    title="Recipient to receive"
    active={receiver}
    supportedCurrencies={supportedCurrencies}
    setAmount={value => {
      editReceiver('amount', value);
      if (value) {
        const sendAmount = exchangeRate
          ? (Number(value) / exchangeRate).toFixed(2)
          : 0;
        editSender('amount', `${sendAmount}`);
      } else {
        editSender('amount', '');
      }
    }}
    setCurrency={value => editReceiver('currency', value)}
  />
  )
}

        </View>

   {
    sender.currency !== receiver.currency && (
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
    )
   }
        <View
          style={{gap: 16, maxWidth: moderateScale(400, 0.3)}}
          className="pt-[64px] mt-auto w-full mx-auto justify-start">
          <ButtonNormal
            disabled={isButtonDisabled}
            onPress={async () => {
              const sendingWallet = wallets.find(item => item.ticker === sender.currency);
              const isInsufficientFunds = sender.amount && sendingWallet?.amount ? Number(sender.amount) >= Number(sendingWallet?.amount) : false;
            if(isInsufficientFunds){
              return displayFlashbar({
                type: "danger",
                message: "Insufficient funds"
              })
            }
            try {
              const initiateTransferResponse =
                await initiateTransferutation.mutateAsync({
                  from: sender.currency,
                  to: receiver.currency,
                });
              const transferId = initiateTransferResponse.data.id;
              const payinKind =
                initiateTransferResponse.data.payinMethods.find(item =>
                  item.kind.includes('WALLET'),
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
           if(payoutMethod){
            dispatch(
              setTransferState({
                currency: {
                  reciever: receiver.currency,
                  sender: sender.currency,
                },
                amount: sender.amount,
                exchangeRate: exchangeRate ? exchangeRate.toString() : '',
                transferId: initiateTransferResponse.data.id,
                payoutMethod,
              }),
            );
            goToNextStage();
           }
           else{
            displayFlashbar({
              type:"danger",
              message: "Sorry transfer method not available"
            })
           }
              }
            } catch (error) {}
            }}
            className="bg-secondary">
            <NormalText className="text-primary/80">Proceed</NormalText>
          </ButtonNormal>
        </View>
      </View>
      {isLoading && <ScreenLoader opacity={0.6} />}
    </>
  );
};
