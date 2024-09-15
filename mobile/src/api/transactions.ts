import { transferxpressApi } from "./base"
import { Currencies } from "./rates";
import { PaymentKind, TransferStatus } from "./transfer";

export const GET_TRANSACTIONS = async()=>{
    return await transferxpressApi.get<GetTransactionsDataResponse>("/transactions")
}

export const GET_TRANSFER_DETAILS = async(transferId:number)=>{
return await transferxpressApi.get<GetTransferDetailsDataResponse>("/transfers/" + transferId)
}

export const REPORT_TRANSACTION = async(data:{
    transferId:number;
    body: {
        reason: string
        other: string
    }
})=>{
    return await transferxpressApi.post("/transactions/" + data.transferId + "/report", data.body)
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
};

type GetTransferDetailsDataResponse = {
    id: number;
    payinCurrencyCode: Currencies;
    payoutCurrencyCode:  Currencies;
    payinAmount: number;
    payoutAmount: number;
    fee: number;
    payinKind: PaymentKind;
    payoutKind: PaymentKind
    narration: string;
    status: TransferStatus;
    createdAt: string;
    payinPaymentDetails:{
        BSB: string | null;
        CLABE: string | null;
        IBAN: string | null;
        accountNumber: string | null;
        address: string | null;
        amount: number;
        bankCode: string | null;
        currencyCode: Currencies;
        routingNumber: string | null;
        sortCode: string | null;
    };
    payoutPaymentDetails:{
        BSB: string | null;
        CLABE: string | null;
        IBAN: string | null;
        accountNumber: string | null;
        address: string | null;
        amount: number;
        bankCode: string | null;
        currencyCode: Currencies;
        routingNumber: string | null;
        sortCode: string | null;
    };
}