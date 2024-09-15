import { View, type TextInputProps, TextInput, StyleSheet } from "react-native";
import { useState } from "react";
import clsx from "clsx";
import ExclamationIcon from "@/assets/icons/exclamation.svg";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { NormalText } from "../Text/NormalText";

interface Props extends TextInputProps {
  title?: string;
  errorMessage?: string;
  touched?: boolean;
  isDisabled?: boolean;
  height: number;
}
export const CustomTextArea = ({
  title,
  errorMessage,
  onChangeText,
  onBlur,
  touched,
  value,
  isDisabled = false,
  height,
  ...props
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const isError = Boolean(touched) && Boolean(errorMessage);

  return (
    <View pointerEvents={isDisabled ? "none" : "auto"}>
      {Boolean(title) && (
        <NormalText
          weight={500}
          size={12}
          className="text-white/80 mb-2"
        >
          {title}
        </NormalText>
      )}

      <View
        style={{
          height: moderateVerticalScale(height, 0.1),
          borderRadius: moderateScale(12, 0.1),
        }}
        className={clsx(
          "w-full relative p-0 bg-dark border border-secondary",
          isFocused && !isError && "flex !border-secondary",
          isError && "flex border-red-500"
        )}
      >

        <TextInput
          value={value}
          onFocus={() => setIsFocused(true)}
          onBlur={(e) => {
            setIsFocused(false);
            if (onBlur) {
              onBlur(e);
            }
          }}
          onChangeText={onChangeText}
          placeholderTextColor={
            isDisabled
              ? "rgba(255, 255, 255, 0.60)"
              : "rgba(255, 255, 255, 0.40)"
          }
          style={{
            borderRadius: moderateScale(12, 0.1),
            textAlignVertical: "top",
          }}
          className={clsx(
            "w-full h-full bg-dark p-1 pl-3 z-[12] text-white",
            isError && "!bg-[#D80707]/10",
            isDisabled && "!bg-[#EEEEEF]",
            props.className
          )}
          {...props}
        />
      </View>

      {isError && (
        <View className="flex flex-row items-center mt-2">
          <View className="w-4 h-4 mr-1">
            <ExclamationIcon width={"100%"} height={"100%"} fill={"#D80707"} />
          </View>
          <
NormalText
            weight={500}
            size={12}
            className=" text-red-500 capitalize"
          >
            {errorMessage}
          </
NormalText>
        </View>
      )}
    </View>
  );
};
