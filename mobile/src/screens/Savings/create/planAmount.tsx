import { BackButton } from "@/_components/Button/BackButton";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { ScreenLoader } from "@/_components/loader_utils/ScreenLoader";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { CurrencyAmountInput } from "@/_components/Transfer/fiat/CurrencyAmountInput";
import { Currencies } from "@/api/rates";
import { SavingsNavigationStackType } from "@/navigation/UserStack/SavingsStack";
import { useFetchRates } from "@/services/queries/useFetchRates";
import { useAppDispatch } from "@/store/hooks";
import { setSavingsPlanState } from "@/store/savingsPlan/slice";
import { useEffect, useState } from "react";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";


interface Props {
    navigation: SavingsNavigationStackType
}
export default function PlanAmount (

    {
navigation
    }:Props

) {
    const dispatch = useAppDispatch();
    const ratesQuery = useFetchRates();
    const supportedSendingCurrencies = ratesQuery.rates ? Object.keys(ratesQuery.rates) : undefined;
    const [paymentDetails, setPaymentDetails] = useState({
        currency: "USD",
        amount: ""
    });
    const editPaymentDetails = (field: 'amount' | 'currency', value: string) => {
        setPaymentDetails(prev => {
          return {
            ...prev,
            [field]: value,
          };
        });
      };
      useEffect(()=>{
if(supportedSendingCurrencies){
  editPaymentDetails("currency", supportedSendingCurrencies[0])
}
      }, [supportedSendingCurrencies?.length]);
      const isButtonDisabled = !paymentDetails.amount;
    return (
        <LayoutNormal>
            <View
            className="grow pb-10"
            >
       <BackButton
            onPress={() => {
             navigation.goBack()
            }}
          />
          <HeaderText weight={700} size={20} className="text-primary">
           Savings amount
          </HeaderText>
          <NormalText size={13} className="text-white/80 mb-10 max-w-[80%]">
          Set an amount that you'll be saving and what wallet you'll be funding your plan from 
          </NormalText>
        <View>
            <CurrencyAmountInput 
            active={paymentDetails}
            supportedCurrencies={supportedSendingCurrencies}
            title="Amount"
            setAmount={(value)=>editPaymentDetails("amount", value)}
            setCurrency={value => editPaymentDetails("currency", value)}
            />
        </View>
        <View
            style={{gap: 16, maxWidth: moderateScale(400, 0.3)}}
            className="pt-[64px] my-auto w-full mx-auto justify-start">
            <ButtonNormal
              disabled={isButtonDisabled}
              onPress={() => {
           dispatch(setSavingsPlanState({
            savingsAmount: paymentDetails.amount,
            fundingCurrency: paymentDetails.currency as Currencies
           }))
           navigation.navigate("create-plan-schedule")
              }}
              className="bg-secondary">
              <NormalText className="text-primary/80">Proceed</NormalText>
            </ButtonNormal>
          </View>
            </View>
            {
              ratesQuery.isPending && <ScreenLoader opacity={0.6} />
            }
        </LayoutNormal>
    )
}