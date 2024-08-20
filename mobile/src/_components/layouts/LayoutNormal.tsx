
import type { ReactNode } from "react";
import { SafeAreaView, StatusBar, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";

interface Props {
  children: ReactNode;
  backgroundColor?: string;
}
export const LayoutNormal = ({
  children,
  backgroundColor = "#041C32",
}: Props) => {
  const { top: safeAreaTop } = useSafeAreaInsets();
  const PaddingTop = safeAreaTop > 0 ? 36 : 78;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <StatusBar
        translucent
        backgroundColor={"transparent"}
        barStyle={"light-content"}
      />
  
        <View
          style={{ height: safeAreaTop, backgroundColor }}
          className="w-full absolute top-0 z-[10]"
        />

      <View
        style={{
          flex: 1,
          paddingTop: PaddingTop + safeAreaTop,
          paddingLeft: scale(16),
          paddingRight: scale(16),
        }}
      >
        {children}
      </View>
    </SafeAreaView>
  );
};
