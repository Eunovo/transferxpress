import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { View } from "react-native";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import CheckmarkIcon from "@/assets/icons/check_mark.svg"
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { useNavigation } from "@react-navigation/native";
import { UserNavigationStack } from "@/navigation/UserStack";
import { useAppDispatch } from "@/store/hooks";
import { clearTransferState } from "@/store/transfer/slice";
import { useTransferState } from "@/store/transfer/useTransferState";


export default function TransferSuccess () {
    const navigation = useNavigation<UserNavigationStack>();
    const dispatch = useAppDispatch();
    const {accountNumber, accountName, currency, transferFee, amount} = useTransferState();
    const goBackToHome = ()=>{
        dispatch(clearTransferState());
        navigation.navigate("main-bottom-tab")
    };
    const totalAmountSent = parseFloat(amount);
    const currencySymbol = flagsAndSymbol[currency.sender as keyof typeof flagsAndSymbol].symbol;
    return(
<LayoutNormal>
<View className="w-full grow pb-10">

<View 
style={{
    gap: 16
}}
className="items-center mb-6">
    <View
          style={{
            width: moderateScale(40, 0.3),
            height: moderateVerticalScale(40, 0.3)
        }}
        className="rounded-full bg-primary items-center justify-center"
        >
<CheckmarkIcon 
      fill={"#04293A"}
      width={moderateScale(30, 0.3)}
      height={moderateVerticalScale(30, 0.3)}
        />
    </View>
<HeaderText
weight={700}
size={20}
className="text-primary text-center"
>
Transfer Request Successful
</HeaderText>
<NormalText
size={13}
className="text-white/80 text-center max-w-[80%]">
Your transacton is processing, we will notify you once it is completed
   </NormalText>
</View>
<View
className="mb-6"
>
<HeaderText
size={20}
className="text-primary text-center"
>
{currencySymbol} {formatToCurrencyString(totalAmountSent, 2)}
</HeaderText>
</View>
<View className="w-full bg-dark p-3 border border-secondary rounded-xl mb-6">
    <View
    className="w-full flex-row justify-between"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
To
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
    {accountName}
</NormalText>
    </View>
    <View  className="w-full border-t border-white/20 my-4"/>
    <View
    className="w-full flex-row justify-between"
    >
        <NormalText
                size={14}
                className="text-white/80"
                >
Account no.
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
{accountNumber}
</NormalText>
    </View>
</View>
<View className="w-full flex-row justify-between bg-dark p-3 border border-secondary rounded-xl">
<NormalText
                size={14}
                className="text-white/80"
                >
Fees
</NormalText>

<NormalText
weight={600}
                size={14}
                className="text-white"
                >
{currencySymbol} {formatToCurrencyString(transferFee, 2)}
</NormalText>
</View>
<View
                        style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                        className="pt-[64px] mt-auto w-full mx-auto justify-start"
                      >
 <ButtonNormal
 onPress={goBackToHome}
       className="bg-secondary" 
        >
            <NormalText 
            className="text-primary/80"
            >
             Done
            </NormalText>
        </ButtonNormal>
 </View>
</View>
</LayoutNormal>

    )
}