import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutWithScroll } from "@/_components/layouts/LayoutWithScroll";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { dollarSymbol } from "@/utils/constants";
import { formatToCurrencyString } from "@/utils/formatToCurrencyString";
import { useState } from "react";
import { View } from "react-native";
import EyeOpenIcon from "@/assets/icons/eye.svg";
import EyeClosedIcon from "@/assets/icons/eye_closed.svg";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import PlusIcon from "@/assets/icons/plus_bold.svg";
import { ButtonNormal } from "@/_components/Button/NormalButton";
import SendIcon from "@/assets/icons/send.svg";




export default function Home (){
    const [showPassword, setShowPassword] = useState(false);
    const togglePassword = () => setShowPassword((prev) => !prev);
    return(
        <LayoutWithScroll>
            <View className="w-full grow pb-10">
                <HeaderText
                size={20}
                weight={600}
                className="text-primary"
                >
                    Welcome Back, User
                </HeaderText>
                <View
                className="w-full bg-dark p-4 border border-dark rounded-xl mt-4"
                >
                    <View className="flex-row items-center justify-between">
                    <View>
  <NormalText
  size={13}
       className="text-white/60 mb-2"
       >
       USD
       </NormalText>

<HeaderText
size={18}
weight={600}
className="text-primary">
    {dollarSymbol}{formatToCurrencyString(5000, 2)}
</HeaderText>
</View>
<CustomPressable
            hitSlop={{ top: 30, bottom: 30, left: 50, right: 50 }}
            onPress={togglePassword}
                        className="bg-secondary p-2 rounded-lg"
          >
            {showPassword ? (
              <EyeClosedIcon stroke={"rgba(255, 255, 255, 0.8)"} width={16} height={16} />
            ) : (
              <EyeOpenIcon stroke={"rgba(255, 255, 255, 0.8)"} width={16} height={16} />
            )}
          </CustomPressable>
</View>
<View  className="w-full border-t border-white/20 my-4"/>
<View
  style={{
    gap: 8
  }}
  className="flex-row items-center mb-2">
  <NormalText
  size={13}
       className="text-white/60"
       >
       Total BTC balance
       </NormalText>
  </View>
<HeaderText
size={18}
weight={600}
className="text-primary">
    {dollarSymbol}{formatToCurrencyString(50000, 2)}
</HeaderText>
                </View>
                <View
                style={{
                    gap: 16
                }}
                className="w-full flex-row mt-6">
                            <CustomPressable
style={{
    width: moderateScale(160, 0.3),
    gap: 8
}}
className="flex-row items-center justify-center px-3 py-3 bg-secondary rounded-xl"
>
                            <SendIcon
    fill={"#ECB365"}
    fillOpacity={0.8}
    />
                        <NormalText
                      weight={500} className="text-primary/80"
                        >
                            Send money
                        </NormalText>
                    </CustomPressable>
                <CustomPressable
style={{
    width: moderateScale(160, 0.3),
    gap: 8
}}
className="flex-row items-center justify-center px-3 py-3 bg-secondary rounded-xl"
>
    <PlusIcon 
    fill={"#ECB365"}
    fillOpacity={0.8}
    />
    <NormalText
    size={15}
    weight={500}
    className="text-primary/80"
    >
        Recieve Money
    </NormalText>
</CustomPressable>
                </View>
                <View className="w-full mt-6">
                    <NormalText 
                    size={13}
                    className="text-white/60 mb-3">
                        Market rates
                    </NormalText>
                    <View
                    style={{
                        width:moderateScale(120, 0.3),
                        height: moderateVerticalScale(70, 0.3)
                    }}
                    className="bg-dark border border-primary/60 rounded-xl p-3"
                    >
                     <NormalText 
                     size={13}
                    
                     className="text-white/60 mb-1">
                        BTC
                     </NormalText>
                     <HeaderText
                     size={13}
                     weight={600}
                     className="text-white/60"
                     >
                     {dollarSymbol} {formatToCurrencyString(61290, 2)}
                     </HeaderText>
                    </View>
          <View className="w-full">
          <View
                    className="w-full flex-row justify-between items-center my-6"
                    >
                        <HeaderText
                        size={20}
                        weight={600}
                        className="text-primary"
                        >
                            Recent Transactions
                        </HeaderText>
                        <CustomPressable
                        style={{
                            maxWidth: moderateScale(100, 0.1)
                        }}
                        className="px-4 py-2 bg-dark border border-primary/60 rounded-xl"
                        >
                            <NormalText
                            size={13}
                            className="text-white/60"
                            >
                                View all
                            </NormalText>
                        </CustomPressable>
                    </View>
<View className="w-full h-[100] p-3 border border-primary/60 rounded-2xl">

</View>
          </View>
                </View>
            </View>
        </LayoutWithScroll>
    )
}