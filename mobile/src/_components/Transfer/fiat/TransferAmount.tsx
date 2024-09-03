import {NormalText} from '@/_components/Text/NormalText';
import {View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {ButtonNormal} from '@/_components/Button/NormalButton';
import {useState} from 'react';
import {CurrencyAmountInput} from './CurrencyAmountInput';
import {useAppDispatch} from '@/store/hooks';
import {setTransferState} from '@/store/transfer/slice';
import {flagsAndSymbol} from '@/utils/constants';
import {useTransferState} from '@/store/transfer/useTransferState';
import { useFetchRates } from '@/services/queries/useFetchRates';
import { ScreenLoader } from '@/_components/loader_utils/ScreenLoader';

interface Props {
  goToNextStage: () => void;
}
export const TransferAmount = ({goToNextStage}: Props) => {
  const dispatch = useAppDispatch();
  const ratesQuery = useFetchRates();
  const {
    amount: recieverAmount,
    currency,
    exchangeRate: exchangeRateFromTransferState,
  } = useTransferState();
  const [sender, setSender] = useState({
    currency: currency.sender,
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
  const [receiver, setReceiver] = useState({
    currency: currency.reciever,
    amount: recieverAmount,
  });
  const editReceiver = (field: 'amount' | 'currency', value: string) => {
    setReceiver(prev => {
      return {
        ...prev,
        [field]: value,
      };
    });
  };
  const exchangeRate = ratesQuery.rates  ? ratesQuery.rates[sender.currency]?.[receiver.currency]?.exchangeRate : null;
  const isButtonDisabled = !sender.amount || !receiver.amount;
  const isLoading = ratesQuery.isPending;
  return (
    <>
    <View>
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
              const recieveAmount = exchangeRate ? (Number(value) * exchangeRate).toFixed(2) : 0;
              editReceiver('amount', `${recieveAmount}`);
            } else {
              editReceiver('amount', '');
            }
          }}
          setCurrency={value => editSender('currency', value)}
        />
        <CurrencyAmountInput
          title="Recipient to receive"
          active={receiver}
          setAmount={value => {
            editReceiver('amount', value);
            if (value) {
              const sendAmount = exchangeRate ?  (Number(value) / exchangeRate).toFixed(2) : 0;
              editSender('amount', `${sendAmount}`);
            } else {
              editSender('amount', '');
            }
          }}
          setCurrency={value => editReceiver('currency', value)}
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
              flagsAndSymbol[sender.currency as keyof typeof flagsAndSymbol]
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
              setTransferState({
                currency: {
                  reciever: receiver.currency,
                  sender: sender.currency,
                },
                amount: receiver.amount,
                exchangeRate: exchangeRate ? exchangeRate.toString() : "",
              }),
            );
            goToNextStage();
          }}
          className="bg-secondary">
          <NormalText className="text-primary/80">Proceed</NormalText>
        </ButtonNormal>
      </View>
    </View>
          {
            isLoading && (
                <ScreenLoader
                opacity={0.6}
                />
            )
        }
    </>
  );
};
