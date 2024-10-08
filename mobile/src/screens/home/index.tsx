import {CustomPressable} from '@/_components/Button/CustomPressable';
import {LayoutWithScroll} from '@/_components/layouts/LayoutWithScroll';
import {HeaderText} from '@/_components/Text/HeaderText';
import {NormalText} from '@/_components/Text/NormalText';
import {flagsAndSymbol} from '@/utils/constants';
import {formatToCurrencyString} from '@/utils/formatToCurrencyString';
import {useEffect, useState} from 'react';
import {Image, RefreshControl, ScrollView, View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import PlusIcon from '@/assets/icons/plus_bold.svg';
import {RecentTransactions} from '@/_components/Home/RecentTransactions';
import {WalletList} from '@/_components/Home/WalletList';
import {useUserState} from '@/store/user/useUserState';
import {SelectWalletModal} from '@/_components/Home/SelectWalletMModal';
import {useFetchRates} from '@/services/queries/useFetchRates';
import {useQuery} from '@tanstack/react-query';
import {GET_USER_PROFILE, GET_USER_WALLETS} from '@/api/user';
import {useAppDispatch} from '@/store/hooks';
import {setUserState} from '@/store/user/slice';
import { ScreenLoader } from '@/_components/loader_utils/ScreenLoader';
import { MarketRateSkeleton } from '@/_components/loader_utils/MarketRateSkeleton';
import { Currencies } from '@/api/rates';
import { useNavigation } from '@react-navigation/native';
import { UserNavigationStack } from '@/navigation/UserStack';
import SwapIcon from "@/assets/icons/swap.svg"
import { GET_TRANSACTIONS } from '@/api/transactions';



export default function Home() {
  const dispatch = useAppDispatch();
  const {shouldRefreshUser} = useUserState()
  const navigation = useNavigation<UserNavigationStack>()
  const userProfileQuery = useQuery({
    queryKey: ['getUserProfile'],
    queryFn: () => GET_USER_PROFILE(),
  });
  const walletQuery = useQuery({
    queryKey: ['getUserWallets'],
    queryFn: () => GET_USER_WALLETS(),
    enabled: userProfileQuery.isSuccess,
  });
  const transactionsQuery = useQuery({
    queryKey: ["getUserTransactions"],
    queryFn: ()=>GET_TRANSACTIONS()
  });
  const transactions = transactionsQuery.data?.data.slice(0, 4) || [];
  const isLoading  = walletQuery.isLoading || userProfileQuery.isLoading || transactionsQuery.isLoading;
  const isRefetching = walletQuery.isRefetching || userProfileQuery.isRefetching || transactionsQuery.isRefetching;
  useEffect(() => {
    if (userProfileQuery.isSuccess) {
      dispatch(
        setUserState({
          profile: userProfileQuery.data.data,
        }),
      );
    }
    if (walletQuery.isSuccess) {
        const walletData = walletQuery.data.data
        .sort((item1, item2) => {
            const itemOneAmout = item1.balance;
            const itemTwoAmount = item2.balance;
            if (item1.currencyCode === "USD" || itemOneAmout > itemTwoAmount  ) {
              return -1; // Move item1 before item2
            } else if (
              item2.currencyCode === "USD" ||
              itemTwoAmount > itemOneAmout 
            ) {
              return 1; // Move item2 before item1
            } else {
              return 0;
            }
          })
        .map(wallet => ({
            id: wallet.id,
            ticker: wallet.currencyCode,
            amount: wallet.balance.toString(),
          }));
      dispatch(
        setUserState({
          wallets: walletData,
          activeWallet: walletData[0]
        }),
      );
    }
  }, [
    userProfileQuery.isSuccess,
    userProfileQuery.isRefetching,
    walletQuery.isSuccess,
    walletQuery.isRefetching,
  ]);
  useEffect(
    ()=>{
if(shouldRefreshUser){
  userProfileQuery.refetch();
  walletQuery.refetch();
  transactionsQuery.refetch();
  dispatch(setUserState({
    shouldRefreshUser: false
  }))
}
    }, [shouldRefreshUser]
  )
  const {rates: exchangeRates} = useFetchRates();
  const {activeWallet, profile, wallets} = useUserState();
  const [showWalletModal, setShowWalletModal] = useState(false);
  const userName = profile ? `${profile.firstname}` : '';

  return (
    <LayoutWithScroll
    refreshControl={
      <RefreshControl
        refreshing={isRefetching}
        onRefresh={() => {
         userProfileQuery.refetch()
         walletQuery.refetch()
         transactionsQuery.refetch()
        }}
        colors={["#ECB365"]}
        tintColor={"#ECB365"}
        style={{ marginTop: 20 }}
      />
    }
    >
      <View className="w-full grow pb-10">
        <HeaderText
          size={20}
          weight={600}
          className="text-primary mb-4 capitalize">
          Welcome Back, {userName}
        </HeaderText>
        <WalletList />
        <View
          style={{
            gap: 16,
          }}
          className="w-full flex-row items-center my-4">
          <CustomPressable
            onPress={() => setShowWalletModal(true)}
            style={{
              gap: 8,
            }}
            className="w-[50%] shrink flex-row items-center justify-center px-3 py-3 bg-secondary rounded-xl">
            <PlusIcon fill={'#ECB365'} fillOpacity={0.8} />
            <NormalText size={15} weight={500} className="text-primary/80">
              Recieve money
            </NormalText>
          </CustomPressable>
          <CustomPressable
            onPress={() => navigation.navigate("swap-stack")}
            style={{
              gap: 8,
            }}
            className="w-[50%] shrink flex-row items-center justify-center px-3 py-3 bg-secondary rounded-xl">
            <SwapIcon fill={'#ECB365'} fillOpacity={0.8} />
            <NormalText size={15} weight={500} className="text-primary/80">
              Swap money
            </NormalText>
          </CustomPressable>
        </View>
   {
!isLoading && exchangeRates && activeWallet && activeWallet?.ticker in exchangeRates && (
    <View className="w-full mt-6">
    <NormalText size={13} className="text-white/80 mb-3">
      Market rates
    </NormalText>
    <ScrollView
      contentContainerStyle={{
        gap: 12
      }}
      className="grow-0"
      horizontal>
      {
 Object.entries(exchangeRates[activeWallet?.ticker as Currencies]).map(item => {
          return (
            <View
              key={item[0]}
              style={{
                width: moderateScale(120, 0.3),
              }}
              className="justify-center bg-dark border border-secondary rounded-xl px-3 py-2">
              <View
                style={{
                  gap: 8,
                }}
                className="flex-row items-center mb-1">
                <Image
                  source={
                    flagsAndSymbol[item[0] as keyof typeof flagsAndSymbol]
                      ?.icon
                  }
                  width={18}
                  height={12}
                  className="rounded w-[18px] h-[15px]"
                />
                <NormalText size={12} className="text-white">
                  {item[0]}
                </NormalText>
              </View>
              <HeaderText size={13} weight={600} className="text-white">
                {
                  
                  item[1].exchangeRate < 1 ? `${flagsAndSymbol[activeWallet.ticker as keyof typeof flagsAndSymbol]?.symbol} ${formatToCurrencyString(1 / item[1].exchangeRate, 2)} = ${flagsAndSymbol[item[0] as keyof typeof flagsAndSymbol]?.symbol} 1` : `${flagsAndSymbol[activeWallet.ticker as keyof typeof flagsAndSymbol]?.symbol} 1 = ${flagsAndSymbol[item[0] as keyof typeof flagsAndSymbol]?.symbol} ${formatToCurrencyString(item[1].exchangeRate , 2)}`
            
                }
              </HeaderText>
            </View>
          );
        })}
    </ScrollView>
  </View>
)
   }
        <RecentTransactions 
        transactions={transactions}
        />
        {showWalletModal && (
          <SelectWalletModal
            showModal={showWalletModal}
            closeModal={() => setShowWalletModal(false)}
          />
        )}
      </View>
      {
            isLoading && (
                <ScreenLoader
                opacity={0.6}
                />
            )
        }
    </LayoutWithScroll>
  );
}
