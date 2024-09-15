import type { ReactNode } from "react";
import { type TouchableOpacityProps, View, Pressable } from "react-native";
import clsx from "clsx";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { moderateVerticalScale } from "react-native-size-matters";

interface Props extends TouchableOpacityProps {
  children: ReactNode;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
export const ButtonNormal = ({
  children,
  ...props
}: Props) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);
  const buttonAnimatedStyle = useAnimatedStyle(() => {
    return {
      opacity: props.disabled ? 0.6 : withTiming(opacity.value),
    };
  });
  const textAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          scale: withTiming(scale.value),
        },
      ],
    };
  });
  return (
    <AnimatedPressable
    {...props}

    onPressIn={() => {
        scale.value = 0.95;
        opacity.value = 0.75;
      }}
      onPressOut={() => {
        scale.value = 1;
        opacity.value = 1;
      }}
      className={clsx("w-full rounded-xl items-center justify-center", props.className)}
 
      style={[
        {
          height: moderateVerticalScale(52, 0.3),
          minHeight: moderateVerticalScale(52, 0.3),
        },
        buttonAnimatedStyle,
        props.style
      ]}
    
    

    >
      {props.disabled && (
        <View className="w-full h-full absolute top-0 left-0 z-[2] bg-white/10 rounded-xl"></View>
      )}

      <Animated.View
        style={[textAnimatedStyle]}
        className="z-[5] grow items-center justify-center"
      >
        {children}
      </Animated.View>
    </AnimatedPressable>
  );
};
