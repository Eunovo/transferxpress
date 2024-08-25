
import { forwardRef, ReactElement, type ReactNode } from "react";
import {
  ScrollView,
  StatusBar,
  SafeAreaView,
  type NativeSyntheticEvent,
  type NativeScrollEvent,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { scale } from "react-native-size-matters";

interface Props {
  children: ReactNode;
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
  refreshControl?: ReactElement;
  backgroundColor?: string;
}
export const LayoutWithScroll = forwardRef<ScrollView, Props>(
  ({ children, onScroll, refreshControl, backgroundColor = "#041C32" }, ref) => {
    const { top: safeAreaTop } = useSafeAreaInsets();
    const PaddingTop = safeAreaTop > 0 ? 36 : 78;
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <StatusBar
          barStyle={"light-content"}
          translucent
          backgroundColor={"transparent"}
        />
      
          <View
            style={{ height: safeAreaTop, backgroundColor }}
            className="w-full absolute top-0 z-[10]"
          />
    
        <ScrollView
          ref={ref}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
          contentContainerStyle={{
            flexGrow: 1,
            paddingTop: PaddingTop + safeAreaTop,
            paddingLeft: scale(16),
            paddingRight: scale(16),
          }}
          onScroll={onScroll}
          refreshControl={refreshControl}
        >
          {children}
        </ScrollView>
      </SafeAreaView>
    );
  }
);
