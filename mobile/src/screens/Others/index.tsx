import { CustomPressable } from "@/_components/Button/CustomPressable";
import { LayoutNormal } from "@/_components/layouts/LayoutNormal";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import { View } from "react-native";
import { moderateScale } from "react-native-size-matters";
import CaretIcon from "@/assets/icons/caret.svg"
import UserIcon from "@/assets/icons/user.svg"
import { useState } from "react";
import { LogoutModal } from "@/_components/Others/LogoutModal";

export default function More () {
    const [showLogoutModal, setShowLogoutModal] = useState(false)
    return(
        <LayoutNormal>
            <View className="grow">
            <HeaderText
weight={700}
size={24}
className="text-primary mb-10"
>
   More
</HeaderText>
<View 
style={{
    gap: 16
}}
className="flex-row w-full p-3 bg-dark border border-secondary rounded-xl"
>
<View
style={{
    width: moderateScale(40),
    height: moderateScale(40)
}}
className="items-center justify-center rounded-full border border-primary"
>
<UserIcon 
fill={"#ECB365"}
/>
</View>
<View>
    <HeaderText
    weight={700}
    className="text-white/80 mb-1"
    >
        Ango Jeffrey
    </HeaderText>
    <NormalText
    className="text-white/60"
    >
        ango@star.com
    </NormalText>
</View>
</View>
<View
style={{
    gap: 40
}}
className="w-full flex-1 pt-10">
<View className="w-full">
    <NormalText
    size={13}
    className="text-white/60 mb-3"
    >
        General
    </NormalText>
    <View className="w-full bg-dark border border-secondary p-4 rounded-xl">
<CustomPressable>
    <View className="w-full flex-row justify-between">
<NormalText
className="text-white/80"
>
   Profile settings
</NormalText>
<CaretIcon 
        width={20}
        height={20}
        fill={"#FFF"}
        fillOpacity={0.6}
        className="rotate-[-90deg] ml-auto"
        />
    </View>
</CustomPressable>
    </View>
</View>
<View className="w-full">
    <NormalText
    size={13}
    className="text-white/60 mb-3"
    >
        Security
    </NormalText>
    <View className="w-full bg-dark border border-secondary p-4 rounded-xl">
    <CustomPressable>
    <View className="w-full flex-row justify-between pb-2 mb-4 border-b border-b-white/20">
<NormalText
className="text-white/80"
>
   Change Password
</NormalText>
<CaretIcon 
        width={20}
        height={20}
        fill={"#FFF"}
        fillOpacity={0.6}
        className="rotate-[-90deg] ml-auto"
        />
    </View>
</CustomPressable>
<CustomPressable>
    <View className="w-full flex-row justify-between">
<NormalText
className="text-white/80"
>
   Change transaction PIN
</NormalText>
<CaretIcon 
        width={20}
        height={20}
        fill={"#FFF"}
        fillOpacity={0.6}
        className="rotate-[-90deg] ml-auto"
        />
    </View>
</CustomPressable>
    </View>
</View>
<View className="w-full">
    <NormalText
    size={13}
    className="text-white/60 mb-3"
    >
       Other
    </NormalText>
    <View className="w-full bg-dark border border-secondary p-4 rounded-xl">
<CustomPressable
onPress={()=>setShowLogoutModal(true)}
>
    <View className="w-full flex-row justify-between">
<NormalText
className="text-white/80"
>
   Logout
</NormalText>
<CaretIcon 
        width={20}
        height={20}
        fill={"#FFF"}
        fillOpacity={0.6}
        className="rotate-[-90deg] ml-auto"
        />
    </View>
</CustomPressable>
    </View>
</View>
</View>
            </View>
            {
                showLogoutModal && (
                    <LogoutModal 
                    showModal={showLogoutModal}
                    closeModal={()=>setShowLogoutModal(false)}
                    />
                )
            }
        </LayoutNormal>
    )
}