import { FlatList, Keyboard, TouchableHighlight, View } from "react-native";
import { useState } from "react";
import { Image } from "react-native";
import { CustomPressable } from "../Button/CustomPressable";
import XmarkIcon from "@/assets/icons/x_mark.svg";
import CaretSolidIcon from "@/assets/icons/caret_solid.svg";
import RNModal from "react-native-modal";
import { SCREEN_HEIGHT } from "@/utils/constants";
import clsx from "clsx";
import Animated, { useSharedValue, withTiming } from "react-native-reanimated";
import { DismissKeyboard } from "../DismissKeyboard";
import { NormalText } from "../Text/NormalText";
import { CustomTextInput } from "./CustomInput";
import { moderateScale, moderateVerticalScale } from "react-native-size-matters";
import { HeaderText } from "../Text/HeaderText";

interface ListBottomSheetProps {
    fieldValue: string;
  selectItem: (option: { value: string; icon?: any; id?: string }) => void;
  options: { value: string; icon?: any; id?: string }[];
  title: string;
  placeholder: string;
  required: boolean;
  searchBarPlaceholder: string;
  disabled?: boolean;
  onModalOpen?: () => void;
  shouldUsePlaceholder?: boolean;
  errorMessage?:string;
  hasBeenTouched?:boolean;
}

export const ListBottomSheet = ({
  selectItem,
  options,
  searchBarPlaceholder,
  title,
  placeholder,
  required,
  shouldUsePlaceholder,
  disabled,
  onModalOpen,
  errorMessage,
  hasBeenTouched,
  fieldValue
}: ListBottomSheetProps) => {
    const [showModal, setShowModal] = useState(false);
  const ViewHeight = useSharedValue(SCREEN_HEIGHT * 0.6);
  const [searchText, setSearchText] = useState("");
  const [filteredOptions, setFilteredOptions] = useState(options);
  const handleChangeSearchText = (value: string) => {
    setSearchText(value);
    if (value) {
      const lowerCaseValue = value.toLowerCase();
      setFilteredOptions(
        options.filter((item) =>
          item.value.toLowerCase().includes(lowerCaseValue)
        )
      );
    }
  };
  const activeIcon = options.find((item) => fieldValue === item.value)?.icon;
  return (
 <>
   <NormalText
                    weight={500}
                    size={12}
                    className=" text-white/80 mb-2"
                  >
                   {title}
                  </NormalText>

                  <CustomPressable
                    onPress={() => {
                      setShowModal((prev) => !prev);
                    }}
                    style={{
                      height: moderateVerticalScale(52, 0.1),
                    }}
                    className={clsx(
                      "rounded-xl w-full  flex-row items-center justify-between bg-dark px-3 border border-secondary",
                      Boolean(
                       errorMessage &&
                          hasBeenTouched
                      ) && "flex border-red-500"
                    )}
                  >
                    {fieldValue ? (
                      <View className={"flex-row items-center"}>
                        {
                            activeIcon && (
                                <Image
                          source={{ uri: activeIcon }}
                          width={20}
                          height={20}
                          alt={fieldValue}
                          className="w-[20px] h-[20px]"
                        />
                            )
                        }
                        <NormalText className="text-white ml-2 capittalize">
                          {fieldValue}
                        </NormalText>
                      </View>
                    ) : (
                      <NormalText size={14} className="text-white/40">
                       {placeholder}
                      </NormalText>
                    )}

                    <CaretSolidIcon width={8} height={10} fill={"rgba(255, 255, 255, 0.8)"} />
                  </CustomPressable>
   {
    showModal && (
        <RNModal
        style={{
          justifyContent: "flex-end",
          margin: 0,
        }}
        isVisible={showModal}
        animationInTiming={500}
        animationOutTiming={500}
        backdropTransitionInTiming={800}
        backdropTransitionOutTiming={800}
        backdropOpacity={0.2}
        backdropColor="#101010"
        deviceHeight={SCREEN_HEIGHT}
        onBackdropPress={() => setShowModal(false)}
        statusBarTranslucent
        swipeDirection={"down"}
        onSwipeComplete={() => setShowModal(false)}
      >
        <DismissKeyboard>
          <Animated.View
            style={[{ flex: 1, maxHeight: ViewHeight }]}
            className={clsx("bg-background rounded-t-xl px-4 pt-6 pb-8")}
          >
            <View className="w-full">
      <View className="items-center flex-row justify-between mb-10">
      <HeaderText size={18} weight={600} className="text-primary my-4">
               Select {title.toLowerCase()}
              </HeaderText>
      <CustomPressable
                onPress={() => setShowModal(false)}
                style={{
                    width: moderateScale(40, 0.1),
                    height: moderateVerticalScale(40, 0.1)
                }}
                className="ml-auto bg-dark border border-secondary rounded-full items-center justify-center"
              >
                <XmarkIcon width={24} height={24} fill="#ECB365" />
              </CustomPressable>
      </View>
             
              <View className="w-full">
                <CustomTextInput
                  value={searchText}
                  onFocus={() => {
                    ViewHeight.value = withTiming(SCREEN_HEIGHT * 0.95);
                  }}
                  onBlur={() => {
                    ViewHeight.value = withTiming(SCREEN_HEIGHT * 0.6);
                  }}
                  onChangeText={handleChangeSearchText}
                  placeholder={searchBarPlaceholder}
                  isSearch
                />
              </View>
            </View>
            <FlatList
              keyboardShouldPersistTaps="handled"
              keyExtractor={(item) =>
                typeof item.id === "number" ? `${item.id}` : item.value
              }
              data={filteredOptions}
              renderItem={({ item }) => (
                <TouchableHighlight
                  onPress={() => {
                    selectItem(item);
                    setSearchText("");
                    setFilteredOptions(options);
                    Keyboard.dismiss();
                    () => setShowModal(false)
                  }}
                  underlayColor={"#EEEEEF"}
                  className="w-full  py-4 px-4 border-b border-b-primary"
                >
                  <View
                    style={{ flex: 1, gap: 8 }}
                    className="flex-row items-center"
                  >
                    {item.icon && (
                      <Image
                        source={item.icon}
                        width={20}
                        height={20}
                        alt={item.value}
                        className="w-[20px] h-[20px]"
                      />
                    )}
                    <NormalText className="text-white/80 capitalize">
                      {item.value}
                    </NormalText>
                  </View>
                </TouchableHighlight>
              )}
            />
          </Animated.View>
        </DismissKeyboard>
      </RNModal>
    )
   }
 </>
  );
};
