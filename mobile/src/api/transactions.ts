import { transferxpressApi } from "./base"
import { Currencies } from "./rates";

export const GET_TRANSACTIONS = async()=>{
    return await transferxpressApi.get<GetTransactionsDataResponse>("/transactions")
}

type GetTransactionsDataResponse = Array<Transaction>;
export type Transaction =   {
    id: number;
    narration: string;
    type: "CREDIT" | "DEBIT";
    currencyCode: Currencies;
    amount: number;
    reference: string;
    transferId: number;
    walletId: number;
    createdAt: string
}