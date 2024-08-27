import {View} from 'react-native';
import {CustomPressable} from '../Button/CustomPressable';
import {NormalText} from '../Text/NormalText';
import {formatToCurrencyString} from '@/utils/formatToCurrencyString';
import { moderateScale, scale } from 'react-native-size-matters';
import { formatDate } from '@/utils/formatDate';
import clsx from 'clsx';
import TransactionArrowIcon from "@/assets/icons/transaction_arrow.svg"



export type Transaction = {
  id: number;
  reference: string;
  walletId: number;
  type: string;
  amount: string;
  createdAt: string;
  completedAt: string;
  narration: string;
};
interface Props {
  totalTransactions: number;
  item: Transaction;
  index: number;
  viewDetails?: (details: Transaction) => void | (() => void);
  isFromHomeScreen?: boolean;
}
export const TransactionRenderItem = ({
  totalTransactions,
  item,
  index,
  viewDetails,
  isFromHomeScreen,
}: Props) => {
    const isDebit = item.type === "debit";
  return (
    <CustomPressable
    onPress={()=>viewDetails?.(item)}
    >
      <View className={
        clsx(
            "w-full flex-row justify-between pb-4 mb-4 border-b border-white/20",
             index === totalTransactions - 1 && "!border-0 !mb-0 !pb-0"
        )
      }>
        <View
          style={{
            gap: 12,
          }}
          className="flex-row items-center">
          <View 
          style={{
            width: moderateScale(30, 0.1),
            height: moderateScale(30, 0.1)
          }}
          className="bg-secondary rounded-full items-center justify-center"
          >
<TransactionArrowIcon 
width={scale(20)}
height={scale(20)}
stroke={isDebit ? "#B42318" : "#55A249"}
className={
    clsx(
        'rotate-0',
        !isDebit && "!rotate-180"
    )
}
/>
          </View>
          <View
          className='grow shrink w-[50%]'
          >
            <NormalText
              size={14}
              weight={500}
              numberOfLines={1}
              ellipsizeMode="tail"
              className="text-primary mb-1 capitalize shrink-0">
             Oluwabukumi Anifowosetobiloba
            </NormalText>
            <NormalText size={12} className="text-white/80">
            {formatDate(item.completedAt)}
            </NormalText>
          </View>
        </View>
        <View
        className='shrink-0'
        >
          <NormalText size={14} weight={500} className="text-white/80 mb-1">
          {isDebit ? "-" : "+"}${formatToCurrencyString(item.amount, 2)}
          </NormalText>
          <NormalText size={12} className="text-white/80">
            Transfer
          </NormalText>
        </View>
      </View>
    </CustomPressable>
  );
};
