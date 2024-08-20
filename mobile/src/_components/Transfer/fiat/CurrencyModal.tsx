import { View, Image } from "react-native";
import RNModal from "react-native-modal";
import { SCREEN_HEIGHT, flagsAndSymbol } from "@/utils/constants";
import WalletIcon from "@/assets/icons/item.svg";
import CloseIcon from "@/assets/icons/x_mark.svg";
import clsx from "clsx";
import { moderateScale, moderateVerticalScale, scale, verticalScale } from "react-native-size-matters";
import { CustomPressable } from "@/_components/Button/CustomPressable";
import { NormalText } from "@/_components/Text/NormalText";
import { HeaderText } from "@/_components/Text/HeaderText";


export type Currency = {
    ticker: string;
    flag: any;
};
interface Props {
  active: Currency;
  showModal: boolean;
  closeModal: () => void;
  handleSelectCurrency: (currency: Currency) => void;
}

export const CurrencyOptionsModal = ({
  showModal,
  closeModal,
  handleSelectCurrency,
  active,
}: Props) => {
    
//   const { walletDetails } = UseCurrentUserState();
//   const wallets =
//     walletDetails && walletDetails.length
//       ? walletDetails.map((wallet) => ({
//           ...wallet,
//           balance: `${flagsAndSymbol[
//             item.currency as keyof typeof flagsAndSymbol
//           ]?.symbol} ${formatNumberWithLetter(item.balance)}`,
//           icon: flagsAndSymbol[item.currency as keyof typeof flagsAndSymbol]
//             ?.icon,
//         }))
//       : [];
const currencies: Currency[] = Object.keys(flagsAndSymbol).map(item => ({ticker: item, flag: flagsAndSymbol[item as keyof typeof flagsAndSymbol].icon }))

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
        className="w-full pt-6 px-6 max-h-[60%] bg-dark rounded-t-xl"
      >

   <View className="w-full flex-row items-center justify-between mb-2">
   <HeaderText weight={500} className="text-white/80">
          Select a currency
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
          {currencies?.map((item) => (
            <CustomPressable
              key={item.ticker}
              onPress={() => handleSelectCurrency(item)}
              className="flex-row justify-between items-center pb-4 mb-4"
            >
              <View className="flex-row items-center">
                <Image
                  source={item.flag}
                  width={25}
                  height={18}
                  className="w-[25px] max-w-[25px] h-[18px] max-h-[18px]"
                />
                <NormalText
                  weight={active.ticker === item.ticker ? 700 : 400}
                  className={clsx(
                    "uppercase text-white/80 ml-2",
                    active.ticker === item.ticker && "!text-primary"
                  )}
                >
                  {item.ticker}
                </NormalText>
              </View>

            </CustomPressable>
          ))}
        </View>
      </View>
    </RNModal>
  );
};
