import { flagsAndSymbol, SCREEN_HEIGHT } from "@/utils/constants"
import { View } from "react-native"
import RNModal from "react-native-modal";
import { HeaderText } from "../Text/HeaderText";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { NormalText } from "../Text/NormalText";
import { moderateScale } from "react-native-size-matters";
import { CustomPressable } from "../Button/CustomPressable";
import XmarkIcon from "@/assets/icons/x_mark.svg";
import { SavingsPlan } from "@/screens/savings";
import { ButtonNormal } from "../Button/NormalButton";
import { useNavigation } from "@react-navigation/native";
import { UserNavigationStack } from "@/navigation/UserStack";
import { useAppDispatch } from "@/store/hooks";
import { setTransferState } from "@/store/transfer/slice";
import { useFetchRates } from "@/services/queries/useFetchRates";
import { Spinner } from "../loader_utils/Spinner";
import { Currencies } from "@/api/rates";


interface Props {
    showModal: boolean;
    closeModal: () => void;
    details: SavingsPlan
}
export const ViewSavingsPlanModal = (
    {
showModal,
closeModal,
details
    }:Props
)=>{
    const navigation = useNavigation<any>();
    const dispatch = useAppDispatch();
    const fundingCurrencySymbol = flagsAndSymbol[details.currencyCode].symbol;
    const ratesQuery = useFetchRates();
    const supportedCurrencyPair = ratesQuery.rates ? ratesQuery.rates[details.currencyCode] : undefined;
    const supportedReceivingCurrencies = supportedCurrencyPair ?  Object.keys(supportedCurrencyPair) : undefined;
    const exchangeRate =  supportedCurrencyPair && supportedReceivingCurrencies ?  supportedCurrencyPair[ supportedReceivingCurrencies[0] as Currencies ]?.exchangeRate  : null;
    return(
        <RNModal
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
        isVisible={showModal}
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        backdropOpacity={0.5}
        backdropColor="#101010"
        deviceHeight={SCREEN_HEIGHT}
        onBackdropPress={() => closeModal()}
        swipeDirection={"down"}
        onSwipeComplete={closeModal}
        statusBarTranslucent
      >
        <View
          style={{ flex: 1 }}
          className="bg-background rounded-t-xl px-6 py-8 max-h-[90%]"
        >
                  <View className="items-center flex-row justify-between mb-10">
      <HeaderText size={18} weight={600} className="text-primary my-4">
             Savings plan details
              </HeaderText>
      <CustomPressable
                onPress={closeModal}
                style={{
                    width: moderateScale(40, 0.1),
                    height: moderateScale(40, 0.1)
                }}
                className="ml-auto bg-dark border border-secondary rounded-full items-center justify-center"
              >
                <XmarkIcon width={24} height={24} fill="#ECB365" />
              </CustomPressable>
      </View>

{
    ratesQuery.isPending && (
        <View className="absolute grow items-center justify-center">
        <Spinner
          circumfrence={80}
          strokeWidth={3}
          strokeColor="#ECB365"
        />
      </View>
    )
}
            <HeaderText
size={20}
className="text-primary text-center mb-3 capitalize"
>
{details.name}
</HeaderText>

<View className="w-full bg-dark p-3 border border-secondary rounded-xl mb-6">
    <View
    className="w-full flex-row justify-between border-b border-b-white/20 pb-4 mb-4"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Balance
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
   {fundingCurrencySymbol} {formatToCurrencyString(details.balance, 2)}
</NormalText>
    </View>

    <View
    className="w-full flex-row justify-between border-b border-b-white/20 pb-4 mb-4"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Payment method
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
{details.currencyCode} Wallet
</NormalText>
    </View>
    <View
    className="w-full flex-row justify-between border-b border-b-white/20 pb-4 mb-4"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
                    Plan status
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white capitalize"
                >
   {details.state}
</NormalText>
    </View>
    <View
    className="w-full flex-row justify-between"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Lock period
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
{details.durationInMonths} Months
</NormalText>
    </View>
</View>
<View className="w-full flex-row justify-between bg-dark p-3 border border-secondary rounded-xl mb-6">
<NormalText
                size={14}
                className="text-white/80"
                >
Maturity date
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
{details.maturityDate}
</NormalText>
</View>

        <View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
 onPress={()=>{
    dispatch(setTransferState({
        currency:{
            sender: details.currencyCode,
            reciever: supportedReceivingCurrencies?.[0] || ""  /* TODO display a flshbar here */
        },
        amount: details.balance,
        exchangeRate: exchangeRate?.toString()
    }))
    navigation.navigate("savings-stack", {
        screen: "withdraw-amount",
        params: Number(details.id)
     })
     closeModal()
 }}
       className="bg-secondary" 
        >
            <NormalText 
            className="text-primary/80"
            >
             Withdraw funds
            </NormalText>
        </ButtonNormal>
 </View>
            </View>
            </RNModal>
    )
}