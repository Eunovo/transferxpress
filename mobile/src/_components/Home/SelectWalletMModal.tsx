import { View, Image } from "react-native";
import RNModal from "react-native-modal";
import { SCREEN_HEIGHT, flagsAndSymbol } from "@/utils/constants";
import CloseIcon from "@/assets/icons/x_mark.svg";
import clsx from "clsx";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import { CustomPressable } from "@/_components/Button/CustomPressable";
import { NormalText } from "@/_components/Text/NormalText";
import { HeaderText } from "@/_components/Text/HeaderText";
import { useAppDispatch } from "@/store/hooks";
import { setUserState } from "@/store/user/slice";
import { ButtonNormal } from "../Button/NormalButton";
import { useUserState } from "@/store/user/useUserState";
import { useNavigation } from "@react-navigation/native";
import { UserNavigationStack } from "@/navigation/UserStack";


export type Currency = {
    ticker: string;
    flag: any;
};
interface Props {
  showModal: boolean;
  closeModal: () => void;
}

export const SelectWalletModal = ({
  showModal,
  closeModal,
}: Props) => {
const dispatch = useAppDispatch();
const navigation = useNavigation<UserNavigationStack>()
const {activeWallet, wallets} = useUserState()
  return (
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
      backdropOpacity={0.2}
      backdropColor="#101010"
      deviceHeight={SCREEN_HEIGHT}
      onBackdropPress={closeModal}
      statusBarTranslucent
      swipeDirection={"down"}
      onSwipeComplete={closeModal}
    >
      <View
        style={{ flex: 1 }}
        className="w-full pt-6 pb-10 px-6 max-h-[70%] bg-dark rounded-t-xl"
      >

   <View className="w-full flex-row items-center justify-between mb-2">
   <HeaderText weight={500} className="text-white/80">
          Select funding destination
        </HeaderText>
        <CustomPressable
onPress={closeModal}
style={{
  width: moderateScale(40, 0.1),
  height: moderateVerticalScale(40, 0.1)
}}
className="items-center justify-center bg-background border border-secondary rounded-full"
>
<CloseIcon width={24} height={24} fill={"#ECB365"} />
</CustomPressable>
   </View>
        <View className="mt-6">
          {wallets.map((item, index) => (
            <CustomPressable
              key={item.ticker}
      onPress={()=>{
        dispatch(
            setUserState({
                activeWallet:item
              })
        )
      }}
              className={
                clsx(
                    "flex-row justify-between items-center pb-4 mb-5 border-b border-b-white/20",
                    index === wallets.length -1 && "!border-b-0"
                )
              }
            >
              <View 
              style={{
                gap: 16
              }}
              className="w-full flex-row items-center">
              <Image
           source={flagsAndSymbol[item.ticker as keyof typeof flagsAndSymbol].icon}
                  width={18}
                  height={12}
                  className="rounded w-[18px] h-[15px]"
                />
            <View className="flex-row items-center">
            <NormalText
            size={15}
            weight={activeWallet.ticker === item.ticker ? 700 : 400}
                  className={clsx(
                    "text-white/80 ml-2"
                  )}
                >
                  {item.ticker.toUpperCase()} Wallet
                </NormalText>

            </View>
            <View 
            style={{
                width: moderateScale(20),
                height: moderateScale(20),
                padding: moderateScale(5)
            }}
            className="items-center justify-center bg-dark border border-secondary rounded-full ml-auto"
            >
  {
    activeWallet.ticker === item.ticker &&  <View className="w-full h-full rounded-full bg-primary" />
  }
            </View>
              </View>

            </CustomPressable>
          ))}
        </View>
   <View className="mt-6">
   <ButtonNormal
   onPress={()=>{
    navigation.navigate("deposit-stack")
    closeModal()
   }}
        className="bg-secondary"
        >
            <NormalText
            weight={500}
            className="text-primary/80"
            >
                Proceed
            </NormalText>
        </ButtonNormal>
   </View>
      </View>
    </RNModal>
  );
};
