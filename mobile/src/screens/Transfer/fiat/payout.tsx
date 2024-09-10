import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { View } from "react-native";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import CopyIcon from "@/assets/icons/copy.svg"
import { ButtonNormal } from "@/_components/Button/NormalButton";
import { TransferNavigationStackType } from "@/navigation/UserStack/TransferStack";
import { flagsAndSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { BackButton } from "@/_components/Button/BackButton";
import { useUserState } from "@/store/user/useUserState";
import { DepositNavigationStackType } from "@/navigation/UserStack/DepositStack";

interface Props {
    navigation: DepositNavigationStackType
};
const  FIELDS = {
    USD: {
       "Account Number":"0123456789",
        secondaryUniqueIdentifier:"123456780"
    },
    EUR: {
        "Account Number":"0324567891",
        secondaryUniqueIdentifier:"1234567890"
    },
    GBP: {
        "Account Number":"22233344550",
        secondaryUniqueIdentifier:"4235456"
    },
    MXN: {
        "Account Number":"7699403330",
        secondaryUniqueIdentifier:"7980456"
    },
    AUD: {
        "Account Number":"5678903032",
        secondaryUniqueIdentifier:"234467"
    },
    KES:{
        "Account Number":"55553355903",
        secondaryUniqueIdentifier: ""

    },
    NGN: {
        "Account Number":"1000567890", 
        secondaryUniqueIdentifier: ""
    },
    GHS:{
        "Account Number":"555777322221",
        secondaryUniqueIdentifier:""
    }
};
const secondaryUniqueIdentifierTitles = {
    USD: 'Routing number',
    EUR: 'International Bank Account Number (IBAN)',
    GBP: 'Sort code',
    MXN: 'CLABE number',
    AUD: 'Bank state branch code (BSB)',
  };
export default function TransferPayout (
    {
navigation
    }:Props
) {
    const {profile, activeWallet} = useUserState();
    const accountName = profile ? `${profile.firstname} ${profile.lastname} - ${activeWallet?.ticker}` : "";
    const accountNumber = FIELDS[activeWallet?.ticker as keyof typeof FIELDS]["Account Number"];
    const secondaryUniqueIdentifier = FIELDS[activeWallet?.ticker as keyof typeof FIELDS]?.secondaryUniqueIdentifier;
    const secondaryUniqueIdentifierTitle = secondaryUniqueIdentifierTitles[activeWallet?.ticker as keyof typeof secondaryUniqueIdentifierTitles];
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
<BackButton
    onPress={()=>navigation.goBack()}
/>
            <HeaderText
   weight={700}
   size={20}
   className="text-primary"
   >
Send money
   </HeaderText>
   <NormalText
size={13}
className="text-white/80 mb-10">
Transfer to account details below
   </NormalText>
   <View 
   style={{
    gap: 40
   }}
   className="w-full p-4 bg-dark border border-secondary rounded-xl"
   >
<View
style={{
    gap: 4
}}
className="items-center pb-4 border-b border-secondary"
>
    <NormalText
    size={12}
    className="text-white/80"
    >
        Amount to send
    </NormalText>
    <HeaderText
    size={20}
    weight={600}
    className="text-primary"
    >
        {flagsAndSymbol.KES.symbol} {formatToCurrencyString(40000, 2)}
    </HeaderText>
</View>

<View
className="w-full flex-row items-center justify-between"
>
<NormalText
className="text-white/80"
>
    Account Name
</NormalText>
<View 
style={{
    gap: 8
}}
className="flex-row items-center">
<NormalText
weight={500}
className="text-white"
>
    {accountName}
</NormalText>
<CopyIcon
fill={"#ECB365"}
fillOpacity={0.6}
width={moderateScale(16, 0.1)}
height={moderateVerticalScale(16, 0.1)}
/>
</View>
</View>
<View
className="w-full flex-row items-center justify-between"
>
<NormalText
className="text-white/80"
>
    Account Number
</NormalText>
<View 
style={{
    gap: 8
}}
className="flex-row items-center">
<NormalText
weight={500}
className="text-white"
>
   {accountNumber}
</NormalText>
<CopyIcon
fill={"#ECB365"}
fillOpacity={0.6}
width={moderateScale(16, 0.1)}
height={moderateVerticalScale(16, 0.1)}
/>
</View>
</View>

{
    secondaryUniqueIdentifier && (
        <View
className="w-full flex-row items-center justify-between"
>
<NormalText
className="text-white/80"
>
   {secondaryUniqueIdentifierTitle}
</NormalText>
<View 
style={{
    gap: 8
}}
className="flex-row items-center">
<NormalText
weight={500}
className="text-white"
>
   {secondaryUniqueIdentifier}
</NormalText>
<CopyIcon
fill={"#ECB365"}
fillOpacity={0.6}
width={moderateScale(16, 0.1)}
height={moderateVerticalScale(16, 0.1)}
/>
</View>
</View>
    )
}
   </View>

   <View
                    style={{ gap: 16, maxWidth: moderateScale(400, 0.3) }}
                    className="pt-[64px] mt-auto w-full mx-auto justify-start"
                  >
<ButtonNormal 
onPress={()=>{
    navigation.navigate("deposit-success")
}}
className="w-full bg-secondary">
    <NormalText
     weight={500} className="text-primary/80">
        I have sent the money
    </NormalText>
</ButtonNormal>
<CustomPressable
onPress={()=>navigation.goBack()}
>
<View 
className="flex-wrap flex-row justify-center mt-2"
>
<NormalText 
weight={500}
className="text-white/80">
   Cancel Transfer
</NormalText>
</View>
</CustomPressable>
</View>
   </View>
   </LayoutNormal>
    )
}
