import {BackButton} from '@/_components/Button/BackButton';
import {ButtonNormal} from '@/_components/Button/NormalButton';
import { displayFlashbar } from '@/_components/Flashbar/displayFlashbar';
import {LayoutNormal} from '@/_components/layouts/LayoutNormal';
import {ScreenLoader} from '@/_components/loader_utils/ScreenLoader';
import {HeaderText} from '@/_components/Text/HeaderText';
import {NormalText} from '@/_components/Text/NormalText';
import {CurrencyAmountInput} from '@/_components/Transfer/fiat/CurrencyAmountInput';
import { Currencies } from '@/api/rates';
import {
  CREATE_QUOTE,
  INITIATE_TRANSFER_PROCESS,
  SUBMIT_PAYIN_INFORMATION,
  SUBMIT_PAYOUT_INFORMATION,
} from '@/api/transfer';
import {UserNavigationStack} from '@/navigation/UserStack';
import { SwapNavigationStackType } from '@/navigation/UserStack/SwapStack';
import {useFetchRates} from '@/services/queries/useFetchRates';
import {useAppDispatch} from '@/store/hooks';
import {setTransferState} from '@/store/transfer/slice';
import {useTransferState} from '@/store/transfer/useTransferState';
import { useUserState } from '@/store/user/useUserState';
import {flagsAndSymbol} from '@/utils/constants';
import {formatToCurrencyString} from '@/utils/formatToCurrencyString';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';


interface Props {
    navigation: SwapNavigationStackType
}
export default function SwapAmount (
    {
navigation
    }:Props
){
    const dispatch = useAppDispatch();
    const userStackNavigation = useNavigation<UserNavigationStack>();
    const {wallets} = useUserState()
    const {
      amount: amountToSend,
      currency,
      exchangeRate: exchangeRateFromTransferState,
    } = useTransferState();
    const [sender, setSender] = useState({
      currency: currency.sender ,
      amount: amountToSend,
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
        amount:  amountToSend
            ? (Number(amountToSend) * Number(exchangeRateFromTransferState)).toFixed(
                2,
              )
            : ""
      });
      const editReceiver = (field: 'amount' | 'currency', value: string) => {
        setReceiver(prev => {
          return {
            ...prev,
            [field]: value,
          };
        });
      };
    const ratesQuery = useFetchRates();
    const initiateTransferutation = useMutation({
      mutationFn: INITIATE_TRANSFER_PROCESS,
    });
    const supportedCurrencyPair = sender.currency && ratesQuery.rates ? ratesQuery.rates[sender.currency as Currencies] : undefined;
    const supportedSendingCurrencies = ratesQuery.rates ? Object.keys(ratesQuery.rates) : undefined;
    const supportedReceivingCurrencies = supportedCurrencyPair ?  Object.keys(supportedCurrencyPair) : undefined;
    const exchangeRate =  supportedCurrencyPair && receiver.currency ?  supportedCurrencyPair[receiver.currency as Currencies]?.exchangeRate  : null;
    useEffect(() => {
      editSender('amount', '');
      editReceiver("amount", "");
      if(!exchangeRate && !supportedReceivingCurrencies){
        displayFlashbar({
            type: "danger",
            message: "Currency pair is unavailable"
        })
      }
    }, [exchangeRate]);
    useEffect(
        ()=>{
if(supportedReceivingCurrencies?.length){
          if(supportedReceivingCurrencies){
        editReceiver("currency", supportedReceivingCurrencies[0])
      }
}
        }, [supportedReceivingCurrencies?.length, sender.currency]
    )
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
        : 'N/A';
    const isButtonDisabled =
      !sender.amount || !receiver.amount || transferExchangeRate === 'N/A';
    const submitPayinInformationMutation = useMutation({
      mutationFn: SUBMIT_PAYIN_INFORMATION,
    });
    const submitPayoutInformationMutation = useMutation({
      mutationFn: SUBMIT_PAYOUT_INFORMATION,
    });
    const createQuoteMutation = useMutation({
      mutationFn: CREATE_QUOTE,
    });
    const isLoading =
      ratesQuery.isPending ||
      initiateTransferutation.isPending ||
      submitPayinInformationMutation.isPending ||
      submitPayoutInformationMutation.isPending ||
      createQuoteMutation.isPending;
    return(
        <LayoutNormal>
        <View className="grow w-full pb-10">
          <BackButton
            onPress={() => {
              userStackNavigation.navigate('main-bottom-tab');
            }}
          />
          <HeaderText weight={700} size={20} className="text-primary">
           Convert Money
          </HeaderText>
          <NormalText size={13} className="text-white/80 mb-10">
           Swap funds accross wallets
          </NormalText>
          <View
            style={{
              gap: 24,
            }}
            className="w-full">

              <CurrencyAmountInput
                title="Send"
                supportedCurrencies={supportedSendingCurrencies}
                active={sender}
                setAmount={value => {
                  editSender('amount', value);
                  if (value) {
                    const recieveAmount = exchangeRate
                      ? (Number(value) * exchangeRate).toFixed(2)
                      : 0;
                    editReceiver("amount", `${recieveAmount}`);
                  } else {
                    editReceiver("amount", "");
                  }
                }}
                setCurrency={value => editSender('currency', value)}
                showBalance
              />
           
   {
    supportedReceivingCurrencies && (
        <CurrencyAmountInput
        supportedCurrencies={supportedReceivingCurrencies}
          title="Receive"
          active={receiver}
          setAmount={value => {
            editReceiver("amount", value);
            if (value) {
              const sendAmount = exchangeRate
                ? (Number(value) / exchangeRate).toFixed(2)
                : 0;
              editSender('amount', `${sendAmount}`);
            } else {
              editSender('amount', '');
            }
          }}
          setCurrency={(value) => {
            editReceiver("currency", value)
          }}
          showBalance
        />
    )
   }
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
                  if (receiver.currency) {
                    const initiateTransferResponse =
                      await initiateTransferutation.mutateAsync({
                        from: sender.currency,
                        to: receiver.currency
                      });
                    const transferId = initiateTransferResponse.data.id;
                    const payinMethod =
                      initiateTransferResponse.data.payinMethods.find(item =>
                        item.kind.includes("WALLET"),
                      );
                    const submitPayinResponse =
                      await submitPayinInformationMutation.mutateAsync({
                        body: {
                          kind: payinMethod?.kind!,
                          walletId: wallets.find(item => item.ticker === sender.currency)?.id,
                        },
                        transferId,
                      });
                    const payoutMethod = submitPayinResponse.data.find(item =>
                      item.kind.includes('WALLET'),
                    );
                    await submitPayoutInformationMutation.mutateAsync({
                      body: {
                        kind: payoutMethod?.kind!,
                        walletId: wallets.find(item => item.ticker === receiver.currency)?.id,
                      },
                      transferId,
                    });
                    const createQuoteResponse =
                      await createQuoteMutation.mutateAsync({
                        body: {
                          amount: `${Number(sender.amount) * Number(exchangeRate)}`,
                          narration: `SWAP-${sender.currency}-to-${receiver.currency}-${transferId}`,
                        },
                        transferId,
                      });
                      const transferFee = createQuoteResponse.data.payin.fees?.reduce((previous, current) => (previous + parseFloat(current.amount)), 0 );
                    dispatch(
                      setTransferState({
                        currency: {
                          sender: sender.currency,
                          reciever: receiver.currency,
                        },
                        amount: sender.amount,
                        exchangeRate: exchangeRate ? exchangeRate.toString() : '',
                        transferId,
                        transferFee: `${transferFee}`,
                      }),
                    );
                   navigation.navigate("swap-summary")
                  }
                } catch (error) {}
              }}
              className="bg-secondary">
              <NormalText className="text-primary/80">Proceed</NormalText>
            </ButtonNormal>
          </View>
        </View>
        {isLoading && <ScreenLoader opacity={0.6} />}
      </LayoutNormal>
    )
}