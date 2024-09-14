import { View, type TextInputProps, TextInput, StyleSheet, Text } from "react-native";
import { NormalText } from "../Text/NormalText";
import { useState } from "react";
import clsx from "clsx";
import ExclamationIcon from "@/assets/icons/exclamation.svg";
import SearchIcon from "@/assets/icons/search.svg";
import { flagsAndSymbol } from "@/utils/constants";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

interface Props  extends TextInputProps {
  title?: string;
  errorMessage?: string;
  touched?: boolean;
  isSearch?: boolean;
  isAmount?: boolean;
  isDisabled?: boolean;
  currency?: string;
  className?:string
}
export const CustomTextInput = ({
  title,
  errorMessage,
  onChangeText,
  onBlur,
  touched,
  value,
  isSearch = false,
  isAmount = false,
  isDisabled = false,
  currency = "NGN",
  className,
  ...props
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const isError = Boolean(touched) && Boolean(errorMessage);
  const symbol = isAmount
    ? flagsAndSymbol[currency as keyof typeof flagsAndSymbol].symbol
    :
     "";
  return (
    <View 
    pointerEvents={isDisabled ? "none" : "auto"}
    className="w-full">
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
          height: moderateVerticalScale(52, 0.1),
          borderRadius: moderateScale(12, 0.1),
        }}
        className={clsx(
          "w-full relative p-0 bg-dark border border-secondary",
          isFocused && !isError && "flex !border-primary",
          isError && "flex !border-red-500"
        )}
      >
        {isSearch && (
          <View
            style={[StyleSheet.absoluteFill]}
            className="justify-center pl-3 z-[20] mt-[17px] w-[18px] h-[18px]"
          >
            <SearchIcon fill={"rgba(255, 255, 255, 0.8)"} width={18} height={18} />
          </View>
        )}
        {isAmount && (
          <View
            style={StyleSheet.absoluteFill}
            className="justify-center pl-3 z-[20] mt-[10px] w-[28px] h-[28px]"
          >
            <NormalText
              weight={500}
              size={18}
              className="text-black/80"
            >
              {symbol}
            </NormalText>
          </View>
        )}
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
            // backgroundColor: "#04293A"
          }}
          className={clsx(
            "w-full h-full bg-dark p-1 pl-3 z-[12] text-white",
            isError && "!bg-[#D80707]/10",
            isDisabled && "!bg-primary",
            isSearch && "pl-9",
            isAmount && "pl-8",
        className
          )}
          {...props}
        />
      </View>

      {isError && (
        <View className="flex flex-row items-center mt-2">
          <View
            style={{
              width: moderateScale(16),
              height: moderateVerticalScale(16),
            }}
            className="mr-1"
          >
            <ExclamationIcon width={"100%"} height={"100%"} fill={"#D80707"} />
          </View>
          <NormalText
            weight={500}
            size={12}
           className="text-red-500 capitalize"
          >
            {errorMessage}
          </NormalText>
        </View>
      )}
    </View>
  );
};
