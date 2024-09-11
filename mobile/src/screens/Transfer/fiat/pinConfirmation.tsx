import {LayoutNormal} from '@/_components/layouts/LayoutNormal';
import {HeaderText} from '@/_components/Text/HeaderText';
import {NormalText} from '@/_components/Text/NormalText';
import {View} from 'react-native';
import {moderateScale} from 'react-native-size-matters';
import {ButtonNormal} from '@/_components/Button/NormalButton';
import {BackButton} from '@/_components/Button/BackButton';
import {TransferNavigationStackType} from '@/navigation/UserStack/TransferStack';
import {PinWithKeyPad} from '@/_components/FormComponents/PinwithKeyPad';
import {useEffect, useState} from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { CANCEL_QUOTE, CONFIRM_QUOTE, GET_TRANSFER_STATUS } from '@/api/transfer';
import { useTransferState } from '@/store/transfer/useTransferState';
import { ScreenLoader } from '@/_components/loader_utils/ScreenLoader';

interface Props {
  navigation: TransferNavigationStackType;
};
const REFETCH_TIMEOUT_TIME = 30 * 1000;
export default function TransferPinConfirmation({navigation}: Props) {
  const [pin, setPin] = useState<string[]>([]);
  const isDisabled = pin.length < 4;
  const {transferId} = useTransferState()
  const confirQuoteMutation = useMutation({
    mutationFn: CONFIRM_QUOTE
   });
   const cancelQuoteMutation = useMutation({
    mutationFn: CANCEL_QUOTE
   });
   const [refetchInterval, setRefetchIntervall] = useState(10000)
   const transferStatusQuery = useQuery({
    queryKey: ["getTransferStatus"],
    queryFn: ()=>GET_TRANSFER_STATUS(transferId!),
    enabled: confirQuoteMutation.isSuccess,
    refetchInterval
   });
   const transferStatus = transferStatusQuery.data?.data.status;
   useEffect(
    ()=>{
if(transferStatusQuery.isSuccess && transferStatus === "SUCCESS" && !isDisabled){
navigation.navigate("transfer-fiat-success")
}
    }, [transferStatusQuery.isSuccess, transferStatusQuery.isRefetching]
   )
   useEffect(
    ()=>{
if(transferStatusQuery.isSuccess){
const refetchTimeout = setTimeout(
()=>{
setRefetchIntervall(0)
navigation.navigate("transfer-fiat-success")
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
            onPress={ async()=>{
              try {
               if(confirQuoteMutation.isSuccess && transferId){
                  await cancelQuoteMutation.mutateAsync(transferId)
               }
               navigation.goBack()
              } catch (error) {
               
              }
               }}
        />
        <HeaderText weight={700} size={20} className="text-primary">
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
