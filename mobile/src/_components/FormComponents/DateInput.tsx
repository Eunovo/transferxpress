import DatePicker from "react-native-date-picker";
import { View } from "react-native";
import { useState } from "react";
import clsx from "clsx";
import ExclamationIcon from "@/assets/icons/exclamation.svg";
import CalendarIcon from "@/assets/icons/calendar.svg";
import { CustomPressable } from "../Button/CustomPressable";
import {
  moderateScale,
  moderateVerticalScale,
} from "react-native-size-matters";
import { NormalText } from "../Text/NormalText";

interface Props {
  title: string;
  touched: boolean;
  errorMessage: string;
  onChange: (value: string) => void;
  fieldValue: string;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
}

export const DateInput = ({
  title,
  touched,
  errorMessage,
  onChange,
  fieldValue,
  placeholder = "Enter a date",
  maximumDate,
  minimumDate,
}: Props) => {
  const [currentDate, setCurrentDate] = useState(
    maximumDate ? maximumDate : new Date()
  );
  const [showPicker, setShowPicker] = useState(false);
  const togglePicker = (value: boolean) => setShowPicker(value);

  return (
    <View>
      {Boolean(title) && (
        <NormalText
          weight={500}
          size={12}
          className=" text-white/80 mb-2"
        >
          {title}
        </NormalText>
      )}

      <CustomPressable onPress={() => togglePicker(true)}>
        <View
          style={{
            height: moderateVerticalScale(52, 0.1),
            borderRadius: moderateScale(12, 0.1),
          }}
          className="flex flex-row items-center justify-between w-full  bg-dark border border-secondary py-1 px-3"
        >
          <NormalText
            className={clsx(
              "text-white/60",
              fieldValue && "text-white"
            )}
          >
            {fieldValue ? fieldValue : placeholder}
          </NormalText>
          <CalendarIcon stroke="#424242" />
        </View>
      </CustomPressable>
      <DatePicker
        modal
        mode="date"
        theme="dark"
        open={showPicker}
        date={currentDate}
        timeZoneOffsetInMinutes={currentDate.getTimezoneOffset() * 2}
        onConfirm={(date) => {
          togglePicker(false);
          const formattedDate = date.toISOString().split("T")[0];
          const current = new Date(formattedDate);
          setCurrentDate(current);
          onChange(formattedDate);
        }}
        onCancel={() => {
          togglePicker(false);
        }}
        maximumDate={maximumDate}
        minimumDate={minimumDate}
      />

      {Boolean(touched) && Boolean(errorMessage) && (
        <View className="flex flex-row  items-center mt-2">
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
