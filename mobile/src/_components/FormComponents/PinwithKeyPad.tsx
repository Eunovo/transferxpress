import { type Dispatch, type SetStateAction } from "react";
import { TouchableHighlight, View } from "react-native";
import DeleteIcon from "@/assets/icons/delete.svg";
import clsx from "clsx";
import { moderateScale, verticalScale } from "react-native-size-matters";
import { NormalText } from "../Text/NormalText";

interface Props {
  pin: string[];
  setPin: Dispatch<SetStateAction<string[]>>;
  maxLength?: number;
}
export const PinWithKeyPad = ({ pin, setPin, maxLength = 4 }: Props) => {
  const fields = Array.from(Array(maxLength).keys());
  const firstSet = [
    {
      id: "1",
      val: "1",
      isNum: true,
      onPress: () => {
        if (pin.length < maxLength) {
          setPin((prev) => [...prev, "1"]);
        }
      },
    },
    {
      id: "2",
      val: "2",
      isNum: true,
      onPress: () => {
        if (pin.length < maxLength) {
          setPin((prev) => [...prev, "2"]);
        }
      },
    },
    {
      id: "3",
      val: "3",
      isNum: true,
      onPress: () => {
        if (pin.length < maxLength) {
          setPin((prev) => [...prev, "3"]);
        }
      },
    },
  ];
  const secondSet = [
    {
      id: "4",
      val: "4",
      isNum: true,
      onPress: () => {
        if (pin.length < maxLength) {
          setPin((prev) => [...prev, "4"]);
        }
      },
    },
    {
      id: "5",
      val: "5",
      isNum: true,
      onPress: () => {
        if (pin.length < maxLength) {
          setPin((prev) => [...prev, "5"]);
        }
      },
    },
    {
      id: "6",
      val: "6",
      isNum: true,
      onPress: () => {
        if (pin.length < maxLength) {
          setPin((prev) => [...prev, "6"]);
        }
      },
    },
  ];
  const thirdSet = [
    {
      id: "7",
      val: "7",
      isNum: true,
      onPress: () => {
        if (pin.length < maxLength) {
          setPin((prev) => [...prev, "7"]);
        }
      },
    },
    {
      id: "8",
      val: "8",
      isNum: true,
      onPress: () => {
        if (pin.length < maxLength) {
          setPin((prev) => [...prev, "8"]);
        }
      },
    },
    {
      id: "9",
      val: "9",
      isNum: true,
      onPress: () => {
        if (pin.length < maxLength) {
          setPin((prev) => [...prev, "9"]);
        }
      },
    },
  ];
  const fourthSet = [
    {
      id: "space",
      val: "_",
      isNum: false,
      onPress: () => {},
    },
    {
      id: "0",
      val: "0",
      isNum: true,
      onPress: () => {
        if (pin.length < maxLength) {
          setPin((prev) => [...prev, "0"]);
        }
      },
    },
    {
      id: "del",
      val: <DeleteIcon width={18} height={18} fill={"#ECB365"} />,
      isNum: false,
      onPress: () => {
        if (pin.length) {
          setPin((prev) => {
            return prev.slice(0, prev.length - 1);
          });
        }
      },
    },
  ];
  return (
    <>
      <View
        style={{ gap: 8, maxWidth: moderateScale(100, 0.1) }}
        className="flex-row justify-center p-3 rounded-md border border-secondary bg-dark"
      >
        {fields.map((field) => (
          <View
            key={field}
            style={{
                width: moderateScale(6),
                height: moderateScale(6)
            }}
            className={clsx(
              "rounded-full items-center justify-center bg-[#B7B8BE]",
              pin.length > field && "bg-primary"
            )}
          />
        ))}
      </View>
      <View
        style={{
          maxWidth: moderateScale(400),
        }}
        className="w-full flex mt-auto mx-auto"
      >
        <View
          style={{ gap: 12 }}
          className="w-full flex flex-row justify-between mb-4"
        >
          {firstSet.map((item) => (
            <TouchableHighlight
              key={item.id}
              onPress={item.onPress}
              underlayColor={"#064663"}
              style={{
                height: verticalScale(48),
              }}
              className="flex items-center justify-center grow rounded-md border border-secondary bg-dark"
            >
              <NormalText size={18} className="text-primary">
                {item.val}
              </NormalText>
            </TouchableHighlight>
          ))}
        </View>
        <View
          style={{ gap: 12 }}
          className="w-full flex flex-row justify-between mb-4"
        >
          {secondSet.map((item) => (
            <TouchableHighlight
              key={item.id}
              onPress={item.onPress}
              underlayColor={"#064663"}
              style={{
                height: verticalScale(48),
              }}
              className="flex items-center justify-center grow rounded-md border border-secondary bg-dark"
            >
              <NormalText size={18} className="text-primary">
                {item.val}
              </NormalText>
            </TouchableHighlight>
          ))}
        </View>
        <View
          style={{ gap: 12 }}
          className="w-full flex flex-row justify-between mb-4"
        >
          {thirdSet.map((item) => (
            <TouchableHighlight
              key={item.id}
              onPress={item.onPress}
              underlayColor={"#064663"}
              style={{
                height: verticalScale(48),
              }}
              className="flex items-center justify-center grow rounded-md border border-secondary bg-dark"
            >
              <NormalText size={18} className="text-primary">
                {item.val}
              </NormalText>
            </TouchableHighlight>
          ))}
        </View>
        <View
          style={{ gap: 12 }}
          className="w-full flex flex-row justify-between mb-4"
        >
          {fourthSet.map((item) => {
            if (!item.isNum) {
              return (
                <TouchableHighlight
                  key={item.id}
                  onPress={() => {
                    if (typeof item.val !== "string") {
                      item.onPress();
                    }
                  }}
                  underlayColor={"#064663"}
                  style={{
                    height: verticalScale(48),
                  }}
                  className={clsx(
                    "flex items-center justify-center grow rounded-md border border-secondary bg-dark",
                    typeof item.val === "string" && "!opacity-0"
                  )}
                >
                  {typeof item.val === "string" ? (
                    <NormalText size={18} className="text-primary">
                      {item.val}
                    </NormalText>
                  ) : (
                    item.val
                  )}
                </TouchableHighlight>
              );
            }
            return (
              <TouchableHighlight
                key={item.id}
                onPress={item.onPress}
                underlayColor={"#064663"}
                style={{
                  height: verticalScale(48),
                }}
                className="flex items-center justify-center grow rounded-md border border-secondary bg-dark"
              >
                <NormalText size={18} className="text-primary">
                  {item.val}
                </NormalText>
              </TouchableHighlight>
            );
          })}
        </View>
      </View>
    </>
  );
};
