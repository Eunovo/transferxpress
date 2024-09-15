import { StyleSheet, Text, type TextProps } from "react-native"
import { moderateScale } from "react-native-size-matters";

interface Props extends TextProps {
weight?: number;
size?: number;
}
export const HeaderText = ({
children,
weight = 500,
size = 16,
...props
}: Props)=>{
    const fontWeight = Number(weight) === 500
      ? HeaderTextStyles.fontMedium
      : Number(weight) === 600
      ? HeaderTextStyles.fontSemiBold
      : Number(weight) === 700 
      ? HeaderTextStyles.fontBold
      : HeaderTextStyles.fontExtraBold;
    return(
    <Text 
    {...props}
    style={[fontWeight, { fontSize: moderateScale(size, 0.1) }, props.style]}
    >
        {children}
    </Text>    
    )
}


export const HeaderTextStyles = StyleSheet.create({
    fontMedium: {
      fontFamily: "Barlow-Medium",
      fontWeight: "500",
    },
    fontSemiBold: {
      fontFamily: "Barlow-SemiBold",
      fontWeight: "600",
    },
    fontBold: {
      fontFamily: "Barlow-Bold",
      fontWeight: "700",
    },
    fontExtraBold: {
        fontFamily: "Barlow-ExtraBold",
        fontWeight: "700",
      },
  });
  