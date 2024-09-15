import {
    type MessageComponentProps,
    hideMessage,
  } from "react-native-flash-message";
  import CloseIcon from "@/assets/icons/x_mark.svg";
  import clsx from "clsx";
  import { View, Image } from "react-native";
  import ExclamationIcon from "@/assets/icons/exclamation.svg";
  import CheckInCircleIcon from "@/assets/icons/check_mark_in_circle.svg";
import { NormalText } from "../Text/NormalText";
import { CustomPressable } from "../Button/CustomPressable";
  
  export const CustomFlashbar = ({ message }: MessageComponentProps) => (
    <View className="w-full items-center">
      <View
        style={{
          backgroundColor:
            flashbarConfig[message.type as keyof typeof flashbarConfig]
              .backgroundColor,
          position: "absolute",
          top: 60,
          height: 60,
        }}
        className={clsx(
          "w-[80%] rounded-lg flex-row items-center px-6",
          message.type === "info" && "!border !border-primary"
        )}
      >
        {Boolean(message.type) &&
          flashbarConfig[message.type as keyof typeof flashbarConfig].icon}
        <NormalText
        numberOfLines={2}
          className={clsx(
            "text-white ml-2 shrink",
            message.type === "info" && "!text-white"
          )}
        >
          {message.message}
        </NormalText> 
        {message.type !== "info" && (
          <CustomPressable
            onPress={hideMessage}
            className={clsx(
              "ml-auto mr-0 z-[30]"
            )}
          >
            <CloseIcon width={24} height={24} fill={"#FFF"} />
          </CustomPressable>
        )}
      </View>
    </View>
  );
  
  export const flashbarConfig = {
    danger: {
      icon: <ExclamationIcon width={24} height={24} fill={"#FFF"} />,
      backgroundColor: "#D92D20",
    },
    success: {
      icon: <CheckInCircleIcon width={24} height={24} fill={"#FFF"} />,
      backgroundColor: "#045B04",
    },
    warning: {
      icon: "",
      backgroundColor: "",
    },
    info: {
      icon: "",
      backgroundColor: "#041C32",
    },
    default: {
      icon: "",
      backgroundColor: "",
    },
    none: {
      icon: "",
      backgroundColor: "",
    },
  };
  