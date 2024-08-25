// import { CustomTabBar } from "@/components/BottomTabs/TabBar";
import { HeaderText } from "@/_components/Text/HeaderText";
import { NormalText } from "@/_components/Text/NormalText";
import Home from "@/screens/home";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import type { NavigationProp } from "@react-navigation/native";
import { moderateScale, moderateVerticalScale, ScaledSheet } from "react-native-size-matters";
import HomeIcon from "@/assets/icons/home.svg"
import TransactionsIcon from "@/assets/icons/transactions.svg"
import TransferIcon from "@/assets/icons/transfer.svg"
import MoreIcon from "@/assets/icons/more.svg"
import HomeActiveIcon from "@/assets/icons/home_active.svg"
import TransactionsActiveIcon from "@/assets/icons/transaction_active.svg"
import TransferActiveIcon from "@/assets/icons/transfer_active.svg"
import MoreActiveIcon from "@/assets/icons/more_active.svg"
import Transactions from "@/screens/Transactions";
import More from "@/screens/Others";
import TransferOptions from "@/screens/Transfer/options";
export type ScreenNames = ["Home"];
export type MainBottomTabsParamList = {
  home: undefined;
  transactions: undefined;
  transfer: undefined;
  others: undefined
};
export type DashboardNavigation = NavigationProp<MainBottomTabsParamList>;
const MainBottomTabs = createBottomTabNavigator<MainBottomTabsParamList>();

export default function MainBottomTabNavigator() {
  return (
    <MainBottomTabs.Navigator
    //   tabBar={(props) => <CustomTabBar tabBarProps={{ ...props }} />}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#ECB365",
        tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)",
        tabBarStyle:[bottomtabStyle.tabStyle, {backgroundColor: "#04293A"}]
      }}
      backBehavior="history"
      // initialRouteName="Profile"
    >
      <MainBottomTabs.Screen
        name="home"
        options={{
          tabBarLabel: ({color}) => (
          <NormalText
          style={{
            color
          }}
          size={14}
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
          height={moderateScale(20)}
          fill={"#ECB365"}
             className="shrink-0"
          />
            ) : (
              <HomeIcon 
          width={moderateScale(25)}
          height={moderateScale(25)}
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
        name="transactions"
        options={{
          
          tabBarLabel: ({color}) => (
            <NormalText
            style={{
              color
            }}
            size={14}
          weight={500}
            >
          Transactions
            </NormalText>
          ),  
          tabBarIcon: ({focused}) => {
            return (
              focused ? 
              (
                <TransactionsActiveIcon
            width={moderateScale(25)}
            height={moderateScale(25)}
            fill={"#ECB365"}
               className="shrink-0"
            />
              ) : (
                <TransactionsIcon 
            width={moderateScale(25)}
            height={moderateScale(25)}
            fill={"#FFF"}
            fillOpacity={0.8}
               className="shrink-0"
            />
              )
            );
        },
        }}
        component={Transactions}
      />
          <MainBottomTabs.Screen
        name="transfer"
        options={{
          tabBarLabel: ({color}) => (
            <NormalText
            style={{
              color
            }}
            size={14}
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
            width={moderateScale(25)}
            height={moderateScale(25)}
            fill={"#ECB365"}
               className="shrink-0"
            />
              ) : (
                <TransferIcon 
            width={moderateScale(25)}
            height={moderateScale(25)}
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
        name="others"
        options={{
          tabBarLabel: ({color}) => (
            <NormalText
            style={{
              color
            }}
            size={14}
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
            width={moderateScale(25)}
            height={moderateScale(25)}
            fill={"#ECB365"}
               className="shrink-0"
            />
              ) : (
                <MoreIcon 
            width={moderateScale(25)}
            height={moderateScale(25)}
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
  iconsize: {
      width: '22@s',
      height: '22@s',
  },
  tabStyle: {
      elevation: 3,
      height: moderateVerticalScale(80, 0.1),
      paddingBottom: moderateScale(20, 0.1),
      // shadowColor: pallete.bottomTabSHadow,
      shadowOffset: {width: 0, height: 8},
      shadowOpacity: 0.1,
      shadowRadius: '40@s',
      borderTopWidth: 1,
      borderTopColor: "#04293A",
  },
});
