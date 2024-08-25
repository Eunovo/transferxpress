import { StyleSheet, Text, type TextProps } from "react-native"
import { moderateScale } from "react-native-size-matters";

interface Props extends TextProps {
weight?: number;
size?: number;
}
export const NormalText = ({
children,
weight = 400,
size = 16,
...props
}: Props)=>{
    const fontWeight = Number(weight) === 400
      ? NormalTextStyles.fontNormal
      : Number(weight) === 500
      ? NormalTextStyles.fontMedium
      : Number(weight) === 600
      ? NormalTextStyles.fontSemiBold
      : NormalTextStyles.fontBold;
    return(
    <Text 
    {...props}
    style={[fontWeight, { fontSize: moderateScale(size, 0.1) }, props.style]}
    >
        {children}
    </Text>    
    )
}


export const NormalTextStyles = StyleSheet.create({
    fontNormal: {
      fontFamily: "Inter-Regular",
      fontWeight: "400",
    },
    fontMedium: {
      fontFamily: "Inter-Medium",
      fontWeight: "500",
    },
    fontSemiBold: {
      fontFamily: "Inter-SemiBold",
      fontWeight: "600",
    },
    fontBold: {
      fontFamily: "Inter-Bold",
      fontWeight: "700",
    },
  });
  