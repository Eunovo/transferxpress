import { FlatList, View, type ViewToken } from "react-native"
import { NormalText } from "../Text/NormalText"
import { Image } from "react-native"
import { flagsAndSymbol, SCREEN_WIDTH } from "@/utils/constants"
import { HeaderText } from "../Text/HeaderText"
import { formatToCurrencyString } from "@/utils/formatToCurrencyString"
import { scale, moderateVerticalScale } from "react-native-size-matters"
import { useWindowDimensions } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  SharedValue,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useEffect, useRef, useState } from "react"
import { CustomPressable } from "../Button/CustomPressable"
import EyeOpenIcon from "@/assets/icons/eye.svg";
import EyeClosedIcon from "@/assets/icons/eye_closed.svg";
import { setUserState, Wallet } from "@/store/user/slice"
import { useUserState } from "@/store/user/useUserState"
import { useAppDispatch } from "@/store/hooks"


export const WalletList = ()=>{
    const dispatch = useAppDispatch()
const {wallets, activeWallet} = useUserState();
const [currentIndex, setCurrentIndex] = useState(0);
    const viewableItemsChanged = useRef(
        ({
          viewableItems,
        }: {
          viewableItems: ViewToken[];
          changed: ViewToken[];
        }) => {
          if (typeof viewableItems[0]?.index === "number") {
       setCurrentIndex(viewableItems[0]?.index)
          }
        }
      );
      const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 });
      const scrollX = useSharedValue(0);
      const onScrollHandler = useAnimatedScrollHandler((event) => {
        scrollX.value = event.contentOffset.x;
      });
      const [showBalance, setShowBalance] = useState(false);
      useEffect(
        ()=>{
          dispatch(setUserState({
            activeWallet: wallets[currentIndex]
           }))
        }, [currentIndex]
      );
    return(
      <View className="w-full my-6 py-4 bg-dark rounded-xl border border-secondary">
{
  wallets && Boolean(wallets.length) && activeWallet && (
    <Animated.FlatList
data={wallets}
renderItem={
    ({item, index})=>(
        <View 
        style={{
            width: SCREEN_WIDTH - scale(32),
            maxWidth:SCREEN_WIDTH - scale(32)
        }}
        className="shrink-0 items-center justify-center">
     <CustomPressable
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            onPress={()=>setShowBalance(prev => !prev)}
          >
            <View
        style={{
            gap: 8,
            minWidth: scale(130)
        }}
        className="flex-row items-center bg-dark border border-secondary p-2 rounded-xl mb-4"
        >
        <Image
                  source={flagsAndSymbol[item.ticker as keyof typeof flagsAndSymbol]?.icon}
                  width={18}
                  height={12}
                  className="rounded w-[18px] h-[15px]"
                />
        <NormalText
        size={12}
        className="text-white/80"
        >
            {item.ticker} Balance
        </NormalText>
   
            {showBalance ? (
              <EyeClosedIcon stroke={"#fff"} width={16} height={16} />
            ) : (
              <EyeOpenIcon stroke={"#fff"} width={16} height={16} />
            )}
        
        </View>
        </CustomPressable>
        <View
        style={{
            gap: 8
        }}
        className="flex-row items-center mb-4"
        >
        <HeaderText
        size={20}
        weight={600}
        className="text-primary"
        >
        { showBalance  ? `${flagsAndSymbol[item.ticker as keyof typeof flagsAndSymbol]?.symbol} ${formatToCurrencyString(item.amount, 2)}` : "******.**"}
        </HeaderText>
        </View>
        <View  className="w-[50%] border-b border-b-white/20" />
    <View className="mt-4">
        <Paginator
        data={wallets}
        scrollX={scrollX}
        />
        </View>
                </View>
    )
}
horizontal
showsHorizontalScrollIndicator={false}
keyExtractor={({id})=>`${id}`}
pagingEnabled
bounces={false}
onViewableItemsChanged={viewableItemsChanged.current}
viewabilityConfig={viewConfig.current}
onScroll={onScrollHandler}
/>
  )
}
      </View>
    )
}





interface Props {
  data: Array<any>;
  scrollX: SharedValue<number>;
}
const Paginator = ({ data, scrollX }: Props) => {
  const { width } = useWindowDimensions();
  return (
    <View
      className="flex flex-row gap-2"
    >
      {data.map((_, index) => {
        const inputRange = [
          (index - 1) * width,
          index * width,
          (index + 1) * width,
        ];
        const animatedStyle = useAnimatedStyle(() => {
          return {
            opacity: interpolate(
              scrollX.value,
              inputRange,
              [0.2, 1, 0.2],
              Extrapolation.CLAMP
            ),
          };
        });
        return (
          <View
            key={`${index}`}
            style={{
                width: scale(4),
                height: scale(4)
            }}
            className="rounded-full bg-primary/20"
          >
            <Animated.View
              style={animatedStyle}
              className="w-full h-full bg-primary rounded-full"
            />
          </View>
        );
      })}
    </View>
  );
};


