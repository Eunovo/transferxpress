import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { View } from "react-native";
import CaretIcon from "@/assets/icons/caret.svg"
import { CustomTextInput } from "@/_components/FormComponents/CustomInput";
import { moderateVerticalScale } from "react-native-size-matters";
import { useNavigation } from "@react-navigation/native";
import { UserNavigationStack } from "@/navigation/UserStack";




export default function TransferOptions () {
   const navigation = useNavigation<UserNavigationStack>();

    const options = [
        {
            title: "Transfer to Bank",
            subTitle:"Transfer funds to surpported banks",
            action: ()=>{
                navigation.navigate("transfer-stack")
            }
        },
        {
            title: "Transfer as BTC",
            subTitle:"Send BTC to a wallet address",
            action: ()=>{}
        },
        {
            title: "Transfer as USDC",
            subTitle:"Send USDC to external wallet address",
            action: ()=>{}
        }
    ];
    const beneficiaries = [
        {
         name: "Anthonia Davis",
         accountNumber: "1234567890"
        }
    ]
    return(
        <LayoutNormal>
            <View className="w-full grow pb-10">
<HeaderText
weight={600}
size={24}
className="mb-10 text-primary"
>
    Transfers
</HeaderText>
<View className="w-full mb-10">
<CustomTextInput 
isSearch
placeholder="Search beneficiaries"
/>
<View 
style={{minHeight: moderateVerticalScale(100, 0.1)}}
className="w-full justify-center">
<NormalText 
className="text-white/60 text-center"
>
    You have no beneficiaries
</NormalText>
</View>
</View>
<View style={{flex:1, gap: 16}} className="w-full">
{
    options.map(item =>(
        <CustomPressable
        key={item.title}
        onPress={item.action}
        className="w-full rounded-xl"
        >
            <View 
            style={{gap: 12}}
            className="flex-row items-center w-full p-4 bg-dark rounded-xl">
        <View>
            <HeaderText
            weight={600}
            className="text-primary"
            >
                {item.title}
            </HeaderText>
            <NormalText
            size={13}
            className="text-white/60"
            >
                {item.subTitle}
            </NormalText>
        </View>
        <CaretIcon 
        width={20}
        height={20}
        fill={"#FFF"}
        fillOpacity={0.6}
        className="rotate-[-90deg] ml-auto"
        />
            </View>
        </CustomPressable>
    ))
}
</View>
            </View>
        </LayoutNormal>
    )
}