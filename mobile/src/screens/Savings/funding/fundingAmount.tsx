import {BackButton} from '@/_components/Button/BackButton';
import {ButtonNormal} from '@/_components/Button/NormalButton';
import { displayFlashbar } from '@/_components/Flashbar/displayFlashbar';
import {LayoutNormal} from '@/_components/layouts/LayoutNormal';
import {ScreenLoader} from '@/_components/loader_utils/ScreenLoader';
import {HeaderText} from '@/_components/Text/HeaderText';
import {NormalText} from '@/_components/Text/NormalText';
import {CurrencyAmountInput} from '@/_components/Transfer/fiat/CurrencyAmountInput';
import {
  CREATE_QUOTE,
  INITIATE_TRANSFER_PROCESS,
  SUBMIT_PAYIN_INFORMATION,
  SUBMIT_PAYOUT_INFORMATION,
} from '@/api/transfer';
import {UserNavigationStack} from '@/navigation/UserStack';
import { SavingsNavigationStackType, SavingsStackParamList } from '@/navigation/UserStack/SavingsStack';
import {useFetchRates} from '@/services/queries/useFetchRates';
import {useAppDispatch} from '@/store/hooks';
import {setTransferState} from '@/store/transfer/slice';
import {useTransferState} from '@/store/transfer/useTransferState';
import {useUserState} from '@/store/user/useUserState';
import { flagsAndSymbol } from '@/utils/constants';
import {formatToCurrencyString} from '@/utils/formatToCurrencyString';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

interface Props {
  navigation: SavingsNavigationStackType;
  route: RouteProp<SavingsStackParamList, "funding-amount">
}
export const FundingAmount = ({navigation, route}: Props) => {
  const dispatch = useAppDispatch();
  const userStackNavigation = useNavigation<UserNavigationStack>();
  const {wallets} = useUserState();
  const {
    amount: amountToSend,
    currency,
    exchangeRate: exchangeRateFromTransferState,
  } = useTransferState();
  const [sender, setSender] = useState({
    currency: currency.sender,
    amount: route.params.amount && typeof exchangeRateFromTransferState === "number" ? (Number(route.params.amount) / exchangeRateFromTransferState).toFixed(2)  : amountToSend,
  }); 

  const editSender = (field: 'amount' | 'currency', value: string) => {
    setSender(prev => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  const [amountToReceive, setAmountToReceive] = useState(
   route.params.amount ? route.params.amount : amountToSend
      ? (Number(amountToSend) * Number(exchangeRateFromTransferState)).toFixed(
          2,
        )
      : '',
  );
  const ratesQuery = useFetchRates();
  const supportedCurrenciesAndPairs =
    ratesQuery.rates 
      ? Object.entries(ratesQuery.rates).filter(item =>
          Object.keys(item[1]).includes(route.params.planCurrency),
        )
      : undefined;
  const supportedCurrencies = supportedCurrenciesAndPairs
    ? supportedCurrenciesAndPairs.map(item => item[0])
    : undefined;
  const initiateTransferutation = useMutation({
    mutationFn: INITIATE_TRANSFER_PROCESS,
  });
  const exchangeRate =
    supportedCurrenciesAndPairs?.length &&
    sender.currency
      ? supportedCurrenciesAndPairs.find(item =>
          item.includes(sender.currency),
        )?.[1][route.params.planCurrency].exchangeRate
      : null;

  useEffect(() => {
    if (supportedCurrencies) {
      editSender('currency', supportedCurrencies[0]);
    }
  }, [supportedCurrencies?.length]);
  useEffect(() => {
    if(!route.params.amount){
      editSender('amount', '');
    }
    if(route.params.amount && typeof exchangeRate === "number"){
      editSender("amount", (Number(route.params.amount) / exchangeRate).toFixed(2) )
    }
  }, [exchangeRate, sender.currency, route.params.planCurrency, route.params.amount]);
  const transferExchangeRate =
    exchangeRate && Number(exchangeRate) < 1
      ? `${
          flagsAndSymbol[sender.currency as keyof typeof flagsAndSymbol]?.symbol
        } ${formatToCurrencyString(1 / Number(exchangeRate), 2)} = ${
          flagsAndSymbol[route.params.planCurrency]
            ?.symbol
        } 1`
      : exchangeRate && Number(exchangeRate) > 1
      ? `${
          flagsAndSymbol[sender.currency as keyof typeof flagsAndSymbol]?.symbol
        } 1 = ${
          flagsAndSymbol[route.params.planCurrency]
            ?.symbol
        } ${formatToCurrencyString(exchangeRate, 2)}`
      : 'N/A';
  const isButtonDisabled =
    !sender.amount || !amountToReceive || transferExchangeRate === 'N/A';
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
  return (
    <LayoutNormal>
      <View className="grow w-full pb-10">
        <BackButton
          onPress={() => {
            userStackNavigation.navigate('main-bottom-tab');
          }}
        />
        <HeaderText weight={700} size={20} className="text-primary">
         Fund Plan
        </HeaderText>
        <NormalText size={13} className="text-white/80 mb-10">
          Fund your savings plan
        </NormalText>
        <View
          style={{
            gap: 24,
          }}
          className="w-full">
          {supportedCurrencies && sender.currency && (
            <CurrencyAmountInput
              title="Send"
              active={sender}
              isReadOnly={{
                amount: route.params.amount ? true : false,
                currency: false
              }}
              supportedCurrencies={supportedCurrencies}
              setAmount={value => {
                editSender('amount', value);
                if (value) {
                  const recieveAmount = exchangeRate
                    ? (Number(value) * exchangeRate).toFixed(2)
                    : 0;
                  setAmountToReceive(`${recieveAmount}`);
                } else {
                  setAmountToReceive('');
                }
              }}
              setCurrency={value => editSender('currency', value)}
              showBalance
            />
          )}
          <CurrencyAmountInput
            isReadOnly={{
              amount: route.params?.amount ? true : false,
              currency: true
            }}
            title="Savings plan to receive"
            active={{
              currency: route.params.planCurrency,
              amount: amountToReceive,
            }}
            setAmount={value => {
              setAmountToReceive(value);
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
            onPress={async () => {
              try {
                const sendingWallet = wallets.find(item => item.ticker === sender.currency);
                const isInsufficientFunds = sender.amount && sendingWallet?.amount ? Number(sender.amount) >= Number(sendingWallet?.amount) : false;
                if(isInsufficientFunds){
                  return displayFlashbar({
                    type: "danger",
                    message: "Insufficient funds"
                  })
                }
                  const initiateTransferResponse =
                    await initiateTransferutation.mutateAsync({
                      from: sender.currency,
                      to: route.params.planCurrency
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
                        walletId: sendingWallet?.id
                      },
                      transferId,
                    });
                  const payoutMethod = submitPayinResponse.data.find(item =>
                    item.kind.includes('WALLET'),
                  );
                  await submitPayoutInformationMutation.mutateAsync({
                    body: {
                      kind: payoutMethod?.kind!,
                      walletId: Number(route.params.planId)
                    },
                    transferId,
                  });
                  const createQuoteResponse =
                    await createQuoteMutation.mutateAsync({
                      body: {
                        amount: `${Number(sender.amount) * Number(exchangeRate)}`,
                        narration: `FUNDING-${transferId}`,
                      },
                      transferId,
                    });
                  const transferFee = createQuoteResponse.data.payin.fees?.reduce((previous, current) => (previous + parseFloat(current.amount)), 0 );
                 
                  dispatch(
                    setTransferState({
                      currency: {
                        sender: sender.currency,
                        reciever: route.params.planCurrency
                      },
                      amount: route.params.amount ? route.params.amount : sender.amount,
                      exchangeRate: exchangeRate ? exchangeRate.toString() : '',
                      transferId,
                      payinMethod,
                      transferFee: `${transferFee}`,
                    }),
                  );
                  navigation.navigate("funding-summary", {
                    isFromPlanCreation: true
                  });
            
              } catch (error) {}
            }}
            className="bg-secondary">
            <NormalText className="text-primary/80">Proceed</NormalText>
          </ButtonNormal>
        </View>
      </View>
      {isLoading && <ScreenLoader opacity={0.6} />}
    </LayoutNormal>
  );
};
