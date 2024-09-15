import { View } from "react-native";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


export const MarketRateSkeleton = ()=>{
    return (
<SkeletonPlaceholder borderRadius={4} backgroundColor="#04293A" highlightColor="#FFFFFF">
<View
style={{
    flexDirection: "row",
    gap: 12,
    overflow: "hidden"
}}
>
{
    [1,2,3,4,5].map(item => (
        <View 
        key={item}
style={{
    opacity: 0.5,
    width: moderateScale(120, 0.3),
    height: moderateVerticalScale(60, 0.3),
    borderRadius: moderateScale(12, 0.3)
}}
 />
    ))
}
</View>
 
    </SkeletonPlaceholder>
    )
}