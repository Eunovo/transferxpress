import {CustomPressable} from '@/_components/Button/CustomPressable';
import {LayoutNormal} from '@/_components/layouts/LayoutNormal';
import {HeaderText} from '@/_components/Text/HeaderText';
import {NormalText} from '@/_components/Text/NormalText';
import {View} from 'react-native';
import {moderateScale, moderateVerticalScale} from 'react-native-size-matters';
import CheckmarkIcon from '@/assets/icons/check_mark.svg';
import {ButtonNormal} from '@/_components/Button/NormalButton';
import {BackButton} from '@/_components/Button/BackButton';
import {TransferNavigationStackType} from '@/navigation/UserStack/TransferStack';
import {PinWithKeyPad} from '@/_components/FormComponents/PinwithKeyPad';
import {useEffect, useState} from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CONFIRM_QUOTE, GET_TRANSFER_STATUS } from '@/api/transfer';
import { useTransferState } from '@/store/transfer/useTransferState';
import { ScreenLoader } from '@/_components/loader_utils/ScreenLoader';
import { SwapNavigationStackType } from '@/navigation/UserStack/SwapStack';

interface Props {
  navigation: SwapNavigationStackType;
};
const REFETCH_TIMEOUT_TIME = 30 * 1000;
export default function SwapPinConfirmation({navigation}: Props) {
  const [pin, setPin] = useState<string[]>([]);
  const {transferId} = useTransferState()
  const confirQuoteMutation = useMutation({
    mutationFn: CONFIRM_QUOTE
   });
   const [refetchInterval, setRefetchIntervall] = useState(10000)
   const transferStatusQuery = useQuery({
    queryKey: ["getTransferStatus"],
    queryFn: ()=>GET_TRANSFER_STATUS(transferId!),
    enabled: confirQuoteMutation.isSuccess,
    staleTime: 0,
    refetchInterval
   });
   const transferStatus = transferStatusQuery.data?.data.status;
   const isDisabled = pin.length < 4 || confirQuoteMutation.isPending || transferStatusQuery.isFetching;
   useEffect(
    ()=>{
if(transferStatusQuery.isSuccess && transferStatus === "SUCCESS" && !isDisabled){
navigation.navigate("swap-success")
}
    }, [transferStatusQuery.isSuccess, transferStatusQuery.isRefetching]
   )
   useEffect(
    ()=>{
if(transferStatusQuery.isSuccess){
const refetchTimeout = setTimeout(
()=>{
setRefetchIntervall(0)
navigation.navigate("swap-success")
}, REFETCH_TIMEOUT_TIME
)
return ()=>{
clearTimeout(refetchTimeout)
}
}
    }, [transferStatusQuery.isSuccess]
   );

   const isLoading = confirQuoteMutation.isPending || transferStatusQuery.isFetching;
  
  return (
    <LayoutNormal>
      <View className="w-full grow pb-10">
        <BackButton 
            onPress={()=>{
               navigation.goBack()
               }}
        />
        <HeaderText weight={700} size={18} className="text-primary">
          Enter PIN
        </HeaderText>
        <NormalText size={13} className="text-white/80 mb-10">
          Enter your 4 digit PIN to authorize the transfer
        </NormalText>

        <PinWithKeyPad pin={pin} setPin={setPin} />
        <View
          style={{maxWidth: moderateScale(400, 0.3)}}
          className="pt-[64px] mt-auto w-full mx-auto justify-start">
          <ButtonNormal
         onPress={async()=>{
          if(transferId){
              try {
                  await confirQuoteMutation.mutateAsync(transferId)
              } catch (error) {
                  
              }
          }
           }}
            disabled={isDisabled}
            className="w-full bg-secondary">
            <NormalText weight={500} className="text-primary/80">
              Proceed
            </NormalText>
          </ButtonNormal>
        </View>
      </View>
      {isLoading && <ScreenLoader opacity={0.6} />}
    </LayoutNormal>
  );
}
