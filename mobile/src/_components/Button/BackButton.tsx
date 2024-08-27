import { CustomPressable } from "@/_components/Button/CustomPressable";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import ArrowIcon from "@/assets/icons/arrow.svg"

interface Props {
    onPress: ()=>void
}

export const BackButton = (
    {
onPress
    }:Props
)=>{
return(
    <CustomPressable
    onPress={onPress}
        style={{
            width: moderateScale(40, 0.3),
            height: moderateVerticalScale(40, 0.3)
        }}
        className="rounded-full bg-primary items-center justify-center mb-4"
        >
            <ArrowIcon
          fill={"#04293A"}
          width={moderateScale(20, 0.3)}
          height={moderateVerticalScale(20, 0.3)}
            />
        </CustomPressable>
)
}