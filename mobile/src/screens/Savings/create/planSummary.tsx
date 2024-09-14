import {LayoutNormal} from '@/_components/layouts/LayoutNormal';
import {View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {HeaderText} from '@/_components/Text/HeaderText';
import {NormalText} from '@/_components/Text/NormalText';
import {ButtonNormal} from '@/_components/Button/NormalButton';
import {flagsAndSymbol} from '@/utils/constants';
import {formatToCurrencyString} from '@/utils/formatToCurrencyString';
import {BackButton} from '@/_components/Button/BackButton';
import {SavingsNavigationStackType} from '@/navigation/UserStack/SavingsStack';
import {formatDate} from '@/utils/formatDate';
import {useSavingsPlanState} from '@/store/savingsPlan/useSavingsPlanState';
import {useMutation} from '@tanstack/react-query';
import {ACTIVATE_PLAN, CREATE_SAVINGS_PLAN} from '@/api/savings';
import {useUserState} from '@/store/user/useUserState';
import {Spinner} from '@/_components/loader_utils/Spinner';
import { useAppDispatch } from '@/store/hooks';
import { setSavingsPlanState } from '@/store/savingsPlan/slice';

interface Props {
  navigation: SavingsNavigationStackType;
}
const today = new Date().toISOString();
export default function PlanSummary({navigation}: Props) {
  const dispatch = useAppDispatch();
  const {wallets} = useUserState();
  const {savingsAmount, fundingCurrency, name, lockPeriod} =
    useSavingsPlanState();
  const fundingCurrencySymbol = flagsAndSymbol[fundingCurrency].symbol;
  const createPlanMMutation = useMutation({
    mutationFn: CREATE_SAVINGS_PLAN,
  });
  const activatePlanMutation = useMutation({
    mutationFn: ACTIVATE_PLAN,
  });
  const isPending =
    createPlanMMutation.isPending ||
    activatePlanMutation.isPending;
  return (
    <LayoutNormal>
      <View className="w-full grow pb-10">
        <BackButton onPress={() => navigation.goBack()} />
        <HeaderText weight={700} size={20} className="text-primary">
          Plan Summary
        </HeaderText>
        <NormalText size={13} className="text-white/80 mb-10">
          Confirm the details of your plan
        </NormalText>
        <View
          style={{
            gap: 12,
          }}
          className="w-full p-4 border border-secondary rounded-xl">
          <HeaderText className="text-primary">Plan information</HeaderText>
          <View className="flex-row justify-between border-b border-b-primary/20 pb-3">
            <NormalText size={14} className="text-white/80">
              Plan name
            </NormalText>

            <NormalText size={14} weight={500} className="text-white">
              {name}
            </NormalText>
          </View>
          <View className="flex-row justify-between border-b border-b-primary/20 pb-3">
            <NormalText size={14} className="text-white/80">
              Periodic amount
            </NormalText>

            <NormalText size={14} weight={500} className="text-white">
              {fundingCurrencySymbol} {formatToCurrencyString(savingsAmount, 2)}
            </NormalText>
          </View>
          <View className="flex-row justify-between">
            <NormalText size={14} className="text-white/80">
              Payment method
            </NormalText>

            <NormalText size={14} weight={500} className="text-white">
              {fundingCurrency} Wallet
            </NormalText>
          </View>

          <HeaderText className="text-primary mt-10">
           Schedule information
          </HeaderText>
          <View className="flex-row justify-between border-b border-b-primary/20 pb-3">
            <NormalText size={14} className="text-white/80">
              Start on
            </NormalText>

            <NormalText size={14} weight={500} className="text-white">
              {formatDate(today)}
            </NormalText>
          </View>
          <View className="flex-row justify-between border-b border-b-primary/20 pb-3">
            <NormalText size={14} className="text-white/80">
              Frequency
            </NormalText>

            <NormalText size={14} weight={500} className="text-white">
              Monthly
            </NormalText>
          </View>
          <View className="flex-row justify-between">
            <NormalText size={14} className="text-white/80">
              Lock period
            </NormalText>

            <NormalText
              size={14}
              weight={500}
              className="text-white capitalize">
              {lockPeriod}
            </NormalText>
          </View>
        </View>

        <View
          style={{gap: 16, maxWidth: moderateScale(400, 0.3)}}
          className="pt-[64px] mt-auto w-full mx-auto justify-start">
          <ButtonNormal
            onPress={async () => {
              try {
                const createPlanResponse =
                  await createPlanMMutation.mutateAsync({
                    name,
                    currencyCode: fundingCurrency,
                    durationInMonths: Number(lockPeriod.replace('Months', '')),
                  });
                const planId = createPlanResponse.data.id;
                const fundingCurrencyWalletId = wallets.find(
                  item => item.ticker === fundingCurrency,
                )?.id;
                if (fundingCurrencyWalletId) {
                  await activatePlanMutation.mutateAsync({
                    planId,
                    body: {
                      amount: savingsAmount,
                      walletId: fundingCurrencyWalletId?.toString(),
                    },
                  });
                  dispatch(setSavingsPlanState({
                    planId: planId.toString()
                  }))
                navigation.navigate("create-plan-success")
                }
              } catch (error) {}
            }}
            className="bg-secondary">
            {!isPending ? (
              <NormalText weight={500} className="text-primary/80">
                Start plan
              </NormalText>
            ) : (
              <Spinner circumfrence={80} strokeWidth={3} />
            )}
          </ButtonNormal>
        </View>
      </View>
    </LayoutNormal>
  );
}
