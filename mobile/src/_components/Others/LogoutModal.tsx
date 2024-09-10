import { View } from "react-native";
import RNModal from "react-native-modal";
import CloseIcon from "@/assets/icons/x_mark.svg";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { SCREEN_HEIGHT } from "@/utils/constants";
import { CustomPressable } from "../Button/CustomPressable";
import { NormalText } from "../Text/NormalText";
import { HeaderText } from "../Text/HeaderText";
import { ButtonNormal } from "../Button/NormalButton";
import { useLogout } from "@/hooks/useLogout";
interface Props {
  showModal: boolean;
  closeModal: () => void;
}

export const LogoutModal = ({
  showModal,
  closeModal
}: Props) => {
    const logout = useLogout()
  return (
    <RNModal
      style={{
        justifyContent: "flex-end",
        margin: 0,
      }}
      deviceHeight={SCREEN_HEIGHT}
      backdropColor="#101010"
      isVisible={showModal}
      animationInTiming={500}
      animationOutTiming={500}
      backdropTransitionInTiming={800}
      backdropTransitionOutTiming={800}
      onBackdropPress={() => closeModal()}
      statusBarTranslucent
      swipeDirection={"down"}
      onSwipeComplete={closeModal}
    >
      <View
        style={{ flex: 1, maxHeight: verticalScale(270) }}
        className="bg-dark rounded-t-xl px-6 pt-10"
      >
     <View className="w-full flex-row items-center justify-between mb-">
   <HeaderText weight={500} className="text-white/80">
     Are you sure you want to logout?
        </HeaderText>
        <CustomPressable
onPress={closeModal}
style={{
  width: moderateScale(40, 0.1),
  height: moderateScale(40, 0.1)
}}
className="items-center justify-center bg-background border border-secondary rounded-full"
>
<CloseIcon width={24} height={24} fill={"#ECB365"} />
</CustomPressable>
   </View>
        <NormalText className="text-white/60">
          You are about to logout of your account. Would you like to proceed?
        </NormalText>
        <View
          style={{
            maxWidth: moderateScale(400),
          }}
          className="w-full  mx-auto mt-6"
        >
          <ButtonNormal className="bg-secondary" onPress={logout}>
            <NormalText className="text-primary/80">
              Yes, log me out
            </NormalText>
          </ButtonNormal>
        </View>
      </View>
    </RNModal>
  );
};
