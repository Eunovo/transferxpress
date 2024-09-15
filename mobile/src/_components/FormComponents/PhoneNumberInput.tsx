import { View, type TextInputProps, TextInput } from "react-native";
import { NormalText } from "../Text/NormalText";
import { useState } from "react";
import clsx from "clsx";
import ExclamationIcon from "@/assets/icons/exclamation.svg";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";

interface Props  extends TextInputProps {
  title?: string;
  errorMessage?: string;
  touched?: boolean;
  isDisabled?: boolean;
  className?:string;
  countryCallingCode?:string | string[];
};
export const PhoneNumberInput = ({
  title,
  errorMessage,
  onChangeText,
  onBlur,
  touched,
  value,
  isDisabled = false,
  className,
  countryCallingCode,
  ...props
}: Props) => {
  const [isFocused, setIsFocused] = useState(false);
  const isError = Boolean(touched) && Boolean(errorMessage);
  return (
    <View className="w-full">
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
          gap: 8
        }}
        className={clsx(
          "w-full flex-row p-0 bg-dark border border-secondary",
          isFocused && !isError && "flex !border-primary",
          isError && "flex !border-red-500"
        )}
      >
{
    countryCallingCode && (
        <View className={"h-full justify-center pl-2 rounded-l-xl"}>
        <NormalText 
        size={14}
        className="text-white">
            +{typeof countryCallingCode === "string" ? countryCallingCode :  countryCallingCode[0]}
        </NormalText>
                </View>
    )
}
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
          }}
          className={clsx(
            "flex-1 h-full bg-dark p-1 pl-2 z-[12] text-white",
            isError && "!bg-[#D80707]/10",
            isDisabled && "!bg-primary",
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
