import { useEffect } from "react";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  withRepeat,
  withSequence,
  Easing,
} from "react-native-reanimated";
import Svg, { Circle, G } from "react-native-svg";

interface Props {
  circumfrence: number;
  strokeWidth: number;
  strokeColor?: string;
}
const AnimatedCircle = Animated.createAnimatedComponent(Circle);
export const Spinner = ({
  circumfrence,
  strokeWidth,
  strokeColor = "white",
}: Props) => {
  const radius = circumfrence / (2 * Math.PI);
  const halfCircle = radius + strokeWidth;
  const diameter = 2 * halfCircle;
  const progress = useSharedValue(0);
  const rotation = useSharedValue(0);
  const startAnimation = () => {
    progress.value = withTiming(0.6, { duration: 1000 });
    progress.value = withRepeat(
      withSequence(
        withTiming(0.7, { duration: 800 }),
        withTiming(0.1, { duration: 2000 })
      ),
      -1,
      true
    );
    rotation.value = withRepeat(
      withTiming(360, { duration: 900, easing: Easing.linear }),
      -1,
      false
    );
  };

  useEffect(() => {
    startAnimation();
  }, []);
  const animatedCircleProps = useAnimatedProps(() => {
    return {
      strokeDashoffset: circumfrence * (1 - progress.value),
    };
  }, []);

  const animatedViewStyle = useAnimatedProps(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  }, []);

  return (
    <Animated.View
      style={animatedViewStyle}
      className="flex items-center justify-center"
    >
      <Svg
        width={diameter}
        height={diameter}
        viewBox={`0 0 ${diameter} ${diameter}`}
      >
        <G origin={`${halfCircle}, ${halfCircle}`} rotation={"-90"}>
          <AnimatedCircle
            cx={"50%"}
            cy={"50%"}
            r={radius}
            animatedProps={animatedCircleProps}
            strokeWidth={strokeWidth}
            stroke={strokeColor}
            fill={"transparent"}
            strokeDasharray={circumfrence}
          />
        </G>
      </Svg>
    </Animated.View>
  );
};