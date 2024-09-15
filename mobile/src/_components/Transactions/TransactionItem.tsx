import {View} from 'react-native';
import {CustomPressable} from '../Button/CustomPressable';
import {NormalText} from '../Text/NormalText';
import {formatToCurrencyString} from '@/utils/formatToCurrencyString';
import { moderateScale, scale } from 'react-native-size-matters';
import { formatDate } from '@/utils/formatDate';
import clsx from 'clsx';
import TransactionArrowIcon from "@/assets/icons/transaction_arrow.svg"
import {type Transaction } from '@/api/transactions';
import { SCREEN_WIDTH } from '@/utils/constants';



export type TransactionItem = Transaction & {
  type: "swap" | "deposit" | "transfer" | "plan-fund" | "fee"
}
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
}: Props) => {
    const isDebit = item.type === "DEBIT";
    const date = new Date(parseFloat(item.createdAt)).toDateString();
    const transactionType = {
      swap: item.narration.includes("SWAP"),
      deposit: item.narration.includes("DEPOSIT"),
      fee: Boolean(item.narration.match(/fee/i)),
      "plan-fund": item.narration.includes("FUNDING"),
      transfer: !item.narration.includes("SWAP") && !item.narration.includes("DEPOSIT") && !Boolean(item.narration.match(/fee/i)) && !item.narration.includes("FUNDING"),
    };
    const type = Object.entries(transactionType).find( ([key, value]) => Boolean(value) )?.[0];
  return (
    <CustomPressable
    onPress={()=>viewDetails?.(item)}
    >
      <View 
      className={
        clsx(
            "w-full flex-row justify-between p-3 rounded-xl mb-4 bg-dark border border-secondary overflow-hidden",
             index === totalTransactions - 1 && "!mb-0"
        )
      }>
        <View
          style={{
            gap: 12,
          }}
          className="flex-row items-center shrink w-[50%]">
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
          className='w-[80%]'
          >
            <NormalText
              size={14}
              weight={500}
              numberOfLines={1}
              ellipsizeMode="tail"
              className="w-full text-primary mb-1 capitalize shrink-0">
           {item.narration}
            </NormalText>
            <NormalText size={12} className="text-white/80">
            {formatDate(date)}
            </NormalText>
          </View>
        </View>
        <View
        className='ml-4 shrink-0 w-[50%] items-end'
        >
          <NormalText size={14} weight={500} 
               numberOfLines={1}
              ellipsizeMode="tail"
          className="text-white/80 mb-1">
          {isDebit ? "-" : "+"}${formatToCurrencyString(item.amount, 2)}
          </NormalText>
          <NormalText size={11} weight={600} className="text-white/80 capitalize">
            {type?.replace("-", " ")}
          </NormalText>
        </View>
      </View>
    </CustomPressable>
  );
};
