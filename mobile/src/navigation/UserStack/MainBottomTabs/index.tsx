import { NormalText } from "@/_components/Text/NormalText";
import Home from "@/screens/home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import { moderateScale, moderateVerticalScale, ScaledSheet } from "react-native-size-matters";
import HomeIcon from "@/assets/icons/home.svg"
import TransferIcon from "@/assets/icons/transfer.svg"
import MoreIcon from "@/assets/icons/more.svg"
import HomeActiveIcon from "@/assets/icons/home_active.svg"
import TransferActiveIcon from "@/assets/icons/transfer_active.svg"
import MoreActiveIcon from "@/assets/icons/more_active.svg"
import More from "@/screens/others";
import TransferOptions from "@/screens/Transfer/options";
import Savings from "@/screens/Savings";
import SavingsIcon from "@/assets/icons/savings_menu.svg"
import SavingsActiveIcon from "@/assets/icons/savings_menu_active.svg"

export type ScreenNames = ["Home"];
export type MainBottomTabsParamList = {
  home: undefined;
  savings: undefined;
  transfer: undefined;
  others: undefined
};
export type DashboardNavigation = NavigationProp<MainBottomTabsParamList>;
const MainBottomTabs = createBottomTabNavigator<MainBottomTabsParamList>();

export default function MainBottomTabNavigator() {
  return (
    <MainBottomTabs.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ECB365",
        tabBarInactiveTintColor: "rgba(205, 205, 205, 0.6)",
        tabBarStyle:[bottomtabStyle.tabStyle, {backgroundColor: "#04293A"}]
      }}
      backBehavior="history"
      // initialRouteName="others"
    >
      <MainBottomTabs.Screen
        name="home"
        options={{
          tabBarLabel: ({color}) => (
          <NormalText
          style={{
            color
          }}
          size={13}
        weight={500}
          >
          Home
          </NormalText>
        ),          
        tabBarIcon: ({focused}) => {
          return (
            focused ? 
            (
              <HomeActiveIcon
          width={moderateScale(20)}
          height={moderateVerticalScale(20)}
          fill={"#ECB365"}
             className="shrink-0"
          />
            ) : (
              <HomeIcon 
          width={moderateScale(20)}
          height={moderateVerticalScale(20)}
          fill={"#FFF"}
          fillOpacity={0.8}
             className="shrink-0"
          />
            )
          );
      },  
        }}
        component={Home}
      />
        <MainBottomTabs.Screen
        name="transfer"
        options={{
          tabBarLabel: ({color}) => (
            <NormalText
            style={{
              color
            }}
            size={13}
          weight={500}
            >
           Transfer
            </NormalText>
          ),  
          tabBarIcon: ({focused}) => {
            return (
              focused ? 
              (
                <TransferActiveIcon
            width={moderateScale(20)}
            height={moderateVerticalScale(20)}
            fill={"#ECB365"}
               className="shrink-0"
            />
              ) : (
                <TransferIcon 
            width={moderateScale(20)}
            height={moderateVerticalScale(20)}
            fill={"#FFF"}
            fillOpacity={0.8}
               className="shrink-0"
            />
              )
            );
        },
        }}
        component={TransferOptions}
      />
          <MainBottomTabs.Screen
        name="savings"
        options={{
          
          tabBarLabel: ({color}) => (
            <NormalText
            style={{
              color
            }}
            size={13}
          weight={500}
            >
          Savings
            </NormalText>
          ),  
          tabBarIcon: ({focused}) => {
            return (
              focused ? 
              (
                <SavingsActiveIcon
            width={moderateScale(20)}
            height={moderateVerticalScale(20)}
            style={{
              maxWidth: moderateScale(20),
              maxHeight: moderateVerticalScale(20)
            }}
            fill={"#ECB365"}
               className="shrink-0"
            />
              ) : (
                <SavingsIcon
            width={moderateScale(20)}
            height={moderateVerticalScale(20)}
            fill={"#FFF"}
            fillOpacity={0.8}
               className="shrink-0"
            />
              )
            );
        },
        }}
        component={Savings}
      />
        
          <MainBottomTabs.Screen
        name="others"
        options={{
          tabBarLabel: ({color}) => (
            <NormalText
            style={{
              color
            }}
            size={13}
          weight={500}
            >
           More
            </NormalText>
          ),  
          tabBarIcon: ({focused}) => {
            return (
              focused ? 
              (
                <MoreActiveIcon
            width={moderateScale(20)}
            height={moderateVerticalScale(20)}
            fill={"#ECB365"}
               className="shrink-0"
            />
              ) : (
                <MoreIcon 
            width={moderateScale(20)}
            height={moderateVerticalScale(20)}
            fill={"#FFF"}
            fillOpacity={0.8}
            className="shrink-0"
            />
              )
            );
        },
        }}
        component={More}
      />
    </MainBottomTabs.Navigator>
  );
}

const bottomtabStyle = ScaledSheet.create({
  tabStyle: {
      elevation: 3,
      height: moderateVerticalScale(60, 0.1),
      paddingBottom: moderateScale(12, 0.1),
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.1,
      shadowRadius: '40@s',
      borderTopWidth: 1,
      borderTopColor: "#04293A",
  },
});
