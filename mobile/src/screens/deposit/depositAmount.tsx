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
import {useFetchRates} from '@/services/queries/useFetchRates';
import {useAppDispatch} from '@/store/hooks';
import {setTransferState} from '@/store/transfer/slice';
import {useTransferState} from '@/store/transfer/useTransferState';
import {useUserState} from '@/store/user/useUserState';
import {DEPOSIT_MOCK_FIELDS, flagsAndSymbol, secondaryUniqueIdentifierTitles} from '@/utils/constants';
import {formatToCurrencyString} from '@/utils/formatToCurrencyString';
import {useNavigation} from '@react-navigation/native';
import {useMutation} from '@tanstack/react-query';
import {useEffect, useState} from 'react';
import {View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';

interface Props {
  navigation: DepositNavigationStackType;
}
export const DepositAmount = ({navigation}: Props) => {
  const dispatch = useAppDispatch();
  const userStackNavigation = useNavigation<UserNavigationStack>();
  const {activeWallet} = useUserState();
  const {
    amount: amountToSend,
    currency,
    exchangeRate: exchangeRateFromTransferState,
  } = useTransferState();
  const [sender, setSender] = useState({
    currency: currency.sender,
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
  const [amountToReceive, setAmountToReceive] = useState(
    amountToSend
      ? (Number(amountToSend) * Number(exchangeRateFromTransferState)).toFixed(
          2,
        )
      : '',
  );
  const ratesQuery = useFetchRates();
  const supportedCurrenciesAndPairs =
    ratesQuery.rates && activeWallet?.ticker
      ? Object.entries(ratesQuery.rates).filter(item =>
          Object.keys(item[1]).includes(activeWallet.ticker),
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
    activeWallet?.ticker &&
    sender.currency
      ? supportedCurrenciesAndPairs.find(item =>
          item.includes(sender.currency),
        )?.[1][activeWallet.ticker as 'NGN'].exchangeRate
      : null;

  useEffect(() => {
    if (supportedCurrencies) {
      editSender('currency', supportedCurrencies[0]);
    }
  }, [supportedCurrencies?.length]);
  useEffect(() => {
    editSender('amount', '');
  }, [exchangeRate, sender.currency, activeWallet?.ticker]);
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
          Receive money
        </HeaderText>
        <NormalText size={13} className="text-white/80 mb-10">
          How much do you want to deposit?
        </NormalText>
        <View
          style={{
            gap: 24,
          }}
          className="w-full">
          {supportedCurrencies && sender.currency && (
            <CurrencyAmountInput
              title="Amount to send"
              active={sender}
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
            />
          )}
          <CurrencyAmountInput
            isReadOnly
            title="Wallet to receive"
            active={{
              currency: activeWallet?.ticker || '',
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
            disabled={isButtonDisabled}
            onPress={async () => {
              try {
                if (activeWallet?.ticker) {
                  const initiateTransferResponse =
                    await initiateTransferutation.mutateAsync({
                      from: sender.currency,
                      to: activeWallet.ticker,
                    });
                  const transferId = initiateTransferResponse.data.id;
                  const payinMethod =
                    initiateTransferResponse.data.payinMethods.find(item =>
                      item.kind.includes('BANK_TRANSFER'),
                    );
                  console.log(payinMethod, "payin method");
                  const payinData = DEPOSIT_MOCK_FIELDS[sender.currency as Currencies];
                  const secondaryUniqueIdentifierTitle = secondaryUniqueIdentifierTitles[sender.currency as keyof typeof secondaryUniqueIdentifierTitles] || "";
                  const submitPayinResponse =
                    await submitPayinInformationMutation.mutateAsync({
                      body: {
                        kind: payinMethod?.kind!,
                        accountNumber: payinData['Account Number'],
                        [secondaryUniqueIdentifierTitle]: payinData.secondaryUniqueIdentifier
                      },
                      transferId,
                    });
                  const payoutMethod = submitPayinResponse.data.find(item =>
                    item.kind.includes('WALLET'),
                  );
                  await submitPayoutInformationMutation.mutateAsync({
                    body: {
                      kind: payoutMethod?.kind!,
                      walletId: activeWallet.id,
                    },
                    transferId,
                  });
                  const createQuoteResponse =
                    await createQuoteMutation.mutateAsync({
                      body: {
                        amount: sender.amount,
                        narration: `DEPOSIT-${transferId}`,
                      },
                      transferId,
                    });
                  const transferFee = createQuoteResponse.data.payin.fee;
                  dispatch(
                    setTransferState({
                      currency: {
                        sender: sender.currency,
                        reciever: activeWallet.ticker,
                      },
                      amount: sender.amount,
                      exchangeRate: exchangeRate ? exchangeRate.toString() : '',
                      transferId,
                      payinMethod,
                      transferFee,
                    }),
                  );
                  navigation.navigate('deposit-summary');
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
