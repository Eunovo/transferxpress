import { View, type TextInputProps, TextInput } from "react-native";
import { useState } from "react";
import clsx from "clsx";
import ExclamationIcon from "@/assets/icons/exclamation.svg";
import { CustomPressable } from "../Button/CustomPressable";
import EyeOpenIcon from "@/assets/icons/eye.svg";
import EyeClosedIcon from "@/assets/icons/eye_closed.svg";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { NormalText } from "../Text/NormalText";

interface Props extends TextInputProps {
  title?: string;
  errorMessage?: string;
  touched?: boolean;
}
export const PasswordInput = ({
  title,
  errorMessage,
  onChangeText,
  onBlur,
  touched,
  value,
  ...props
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const togglePassword = () => setShowPassword((prev) => !prev);
  const isError = Boolean(touched) && Boolean(errorMessage);
  return (
    <View>
      {Boolean(title) && (
        <NormalText
          size={12}
          weight={500}
          className="text-white/80 mb-2"
        >
          {title}
        </NormalText>
      )}

      <View
        style={{
          height: moderateVerticalScale(52, 0.1),
          borderRadius: moderateScale(12, 0.1),
        }}
        className={clsx(
          "w-full relative p-0 bg-dark border border-secondary",
          isFocused && !isError && "flex !border-primary",
          isError && "flex border-red-500"
        )}
      >
        <View
          className={clsx(
            "flex flex-row items-center w-full h-full z-[12]",
            isError && "!bg-[#D80707]/10"
          )}
        >
          <TextInput
            style={{ flex: 1, borderRadius: moderateScale(12, 0.1) }}
            value={value}
            onFocus={() => setIsFocused(true)}
            onBlur={(e) => {
              setIsFocused(false);
              if (onBlur) {
                onBlur(e);
              }
            }}
            onChangeText={onChangeText}
            secureTextEntry={!showPassword}
            placeholderTextColor="rgba(255, 255, 255, 0.40)"
            className="h-full p-1 pl-3 z-[12] text-white"
            {...props}
          />
          <CustomPressable
            hitSlop={{ top: 30, bottom: 30, left: 50, right: 50 }}
            onPress={togglePassword}
            className="mr-3"
          >
            {showPassword ? (
              <EyeClosedIcon stroke={"#fff"} width={16} height={16} />
            ) : (
              <EyeOpenIcon stroke={"#fff"} width={16} height={16} />
            )}
          </CustomPressable>
        </View>
      </View>

      {isError && (
        <View className="flex flex-row  items-center mt-2">
          <View className="w-4 h-4 mr-1">
            <ExclamationIcon width={"100%"} height={"100%"} fill={"#D80707"} />
          </View>
          <NormalText
            weight={500}
            size={12}
            className=" text-red-500 capitalize"
          >
            {errorMessage}
          </NormalText>
        </View>
      )}
    </View>
  );
};
