import { View } from "react-native"
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import SkeletonPlaceholder from 'react-native-skeleton-placeholder';


export const MarketRateSkeleton = ()=>{
    return (
<SkeletonPlaceholder borderRadius={4} backgroundColor="#04293A">
<SkeletonPlaceholder.Item flexDirection="row" gap={12} overflow="hidden">
<SkeletonPlaceholder.Item opacity={0.5} width={moderateScale(120, 0.3)} height={moderateVerticalScale(60, 0.3)} borderRadius={moderateScale(12, 0.3)} />
<SkeletonPlaceholder.Item opacity={0.5} width={moderateScale(120, 0.3)} height={moderateVerticalScale(60, 0.3)} borderRadius={moderateScale(12, 0.3)} />
<SkeletonPlaceholder.Item opacity={0.5} width={moderateScale(120, 0.3)} height={moderateVerticalScale(60, 0.3)} borderRadius={moderateScale(12, 0.3)} />
<SkeletonPlaceholder.Item opacity={0.5} width={moderateScale(120, 0.3)} height={moderateVerticalScale(60, 0.3)} borderRadius={moderateScale(12, 0.3)} />
</SkeletonPlaceholder.Item>
 
    </SkeletonPlaceholder>
    )
}