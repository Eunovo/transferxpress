import { View, StyleSheet } from "react-native";
import { Spinner } from "./Spinner";
import { moderateScale, scale, verticalScale } from "react-native-size-matters";
import { NormalText } from "../Text/NormalText";

interface Props {
  opacity?: number;
}
export const ScreenLoader = ({ opacity }: Props) => {
  return (
    <View
      style={[StyleSheet.absoluteFill, { opacity }]}
      className="bg-background items-center justify-center z-[999]"
    >
      <View
        style={{
          shadowColor: "#000000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.16,
          shadowRadius: 1.51,
          elevation: 1,
          width: scale(80),
          height: verticalScale(80),
        }}
        className=" rounded-xl"
      >
        <View className="w-full h-full rounded-xl items-center justify-center">
          <Spinner
            strokeColor="#ECB365"
            circumfrence={moderateScale(70)}
            strokeWidth={moderateScale(3)}
          />
        </View>
      </View>
    </View>
  );
};