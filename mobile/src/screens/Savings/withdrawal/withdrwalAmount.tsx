import {BackButton} from '@/_components/Button/BackButton';
import {ButtonNormal} from '@/_components/Button/NormalButton';
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
import {DepositNavigationStackType} from '@/navigation/UserStack/DepositStack';
import { SavingsNavigationStackType, SavingsStackParamList } from '@/navigation/UserStack/SavingsStack';
import {useFetchRates} from '@/services/queries/useFetchRates';
import {useAppDispatch} from '@/store/hooks';
import {setTransferState} from '@/store/transfer/slice';
import {useTransferState} from '@/store/transfer/useTransferState';
import {useUserState} from '@/store/user/useUserState';
import {DEPOSIT_MOCK_FIELDS, flagsAndSymbol, secondaryUniqueIdentifierTitlesAndKeys} from '@/utils/constants';
import {formatToCurrencyString} from '@/utils/formatToCurrencyString';
import {RouteProp, useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

interface Props {
  navigation: SavingsNavigationStackType;
  route: RouteProp<SavingsStackParamList, "withdraw-amount">
}
export const WithdrawalAmount = ({navigation, route}: Props) => {
  const dispatch = useAppDispatch();
  const userStackNavigation = useNavigation<UserNavigationStack>();
  const {wallets} = useUserState()
  const {
    amount: amountToSend,
    currency,
    exchangeRate: exchangeRateFromTransferState,
  } = useTransferState();
  const [sender] = useState({
    currency: currency.sender,
    amount: amountToSend,
  });


  const [receiverCurrency, setReceiverCurrency] = useState(currency.reciever)
  const receiverAmount = (Number(amountToSend) * Number(exchangeRateFromTransferState)).toFixed(
    2,
  );

  const initiateTransferutation = useMutation({
    mutationFn: INITIATE_TRANSFER_PROCESS,
  });
  const submitPayinInformationMutation = useMutation({
    mutationFn: SUBMIT_PAYIN_INFORMATION,
  });
  const submitPayoutInformationMutation = useMutation({
    mutationFn: SUBMIT_PAYOUT_INFORMATION,
  });
  const createQuoteMutation = useMutation({
    mutationFn: CREATE_QUOTE,
  });
  const ratesQuery = useFetchRates();
  const supportedCurrencyPair = sender.currency && ratesQuery.rates ? ratesQuery.rates[sender.currency as Currencies] : undefined;
  const supportedReceivingCurrencies = supportedCurrencyPair ?  Object.keys(supportedCurrencyPair) : undefined;
  const exchangeRate =  supportedCurrencyPair && receiverCurrency ?  supportedCurrencyPair[receiverCurrency as Currencies]?.exchangeRate  : null;
  const transferExchangeRate =
    exchangeRate && Number(exchangeRate) < 1
      ? `${
          flagsAndSymbol[sender.currency as keyof typeof flagsAndSymbol]?.symbol
        } ${formatToCurrencyString(1 / Number(exchangeRate), 2)} = ${
          flagsAndSymbol[receiverCurrency as keyof typeof flagsAndSymbol]
            ?.symbol
        } 1`
      : exchangeRate && Number(exchangeRate) > 1
      ? `${
          flagsAndSymbol[sender.currency as keyof typeof flagsAndSymbol]?.symbol
        } 1 = ${
          flagsAndSymbol[receiverCurrency as keyof typeof flagsAndSymbol]
            ?.symbol
        } ${formatToCurrencyString(exchangeRate, 2)}`
      
      :  'N/A';
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
        <HeaderText weight={700} size={18} className="text-primary">
          Withdraw money
        </HeaderText>
        <NormalText size={13} className="text-white/80 mb-10">
         Withdraw funds from savings plan
        </NormalText>
        <View
          style={{
            gap: 24,
          }}
          className="w-full">
       
            <CurrencyAmountInput
              title="Send"
              active={sender}
              isReadOnly={{
                currency: true,
                amount: true
              }}
              setAmount={() => {}}
              setCurrency={() => {}}
            />
          <CurrencyAmountInput
            isReadOnly={{
              amount: true,
              currency: false
            }}
            title="Wallet to receive"   
            active={{
              currency: receiverCurrency,
              amount: receiverAmount
            }}
            supportedCurrencies={supportedReceivingCurrencies}
            setAmount={() => {}}
            setCurrency={(value) => {
              setReceiverCurrency(value)
            }}
            showBalance
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
            onPress={async () => {
              try {
                if (receiverCurrency) {
                  const initiateTransferResponse =
                    await initiateTransferutation.mutateAsync({
                      from: sender.currency,
                      to: receiverCurrency
                    });
                  const transferId = initiateTransferResponse.data.id;
                  const payinMethod =
                    initiateTransferResponse.data.payinMethods.find(item =>
                      item.kind.includes("WALLET"),
                    );
               
                 const submitPayinResponse =  await submitPayinInformationMutation.mutateAsync({
                      body: {
                        kind: payinMethod?.kind!,
                        walletId: route.params.walletd
                      },
                      transferId,
                    });
                  const payoutMethod = submitPayinResponse.data.find(item =>
                    item.kind.includes('WALLET'),
                  );
                  await submitPayoutInformationMutation.mutateAsync({
                    body: {
                      kind: payoutMethod?.kind!,
                      walletId: wallets.find(item => item.ticker === receiverCurrency)?.id
                    },
                    transferId,
                  });
                  const createQuoteResponse =
                    await createQuoteMutation.mutateAsync({
                      body: {
                        amount: receiverAmount,
                        narration: `DEPOSIT-${transferId}`,
                      },
                      transferId,
                    });
                  const transferFee = createQuoteResponse.data.payin.fees;
                  dispatch(
                    setTransferState({
                      currency: {
                        sender: sender.currency,
                        reciever: currency.reciever,
                      },
                      amount: sender.amount,
                      exchangeRate: exchangeRate ? exchangeRate.toString() : '',
                      transferId,
                      payinMethod,
                      // transferFee,
                    }),
                  );
                  navigation.navigate("withdraw-summary");
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
  );
};
