import { transferxpressApi } from "./base";

export const INITIATE_TRANSFER_PROCESS = async(paths:{
    from: string;
    to: string
})=>{
    return await transferxpressApi.post<InitiateTransferProcessDataResponse>("/transfers/start/" + paths.from + "/" + paths.to, {})
}

export const SUBMIT_PAYIN_INFORMATION  = async(data:{
    body:{
        kind: PaymentKind;
        walletId?:number;
        accountNumber?:string;
        routingNumber?:string;
        sortCode?:string;
        BSB?:string;
        IBAN?:string;
        CLABE?:string;
        address?:string;

    },
    transferId: number
})=>{
    console.log(data.body, "body");
    
    return await transferxpressApi.post<Array<PaymentMethod>>("/transfers/" + data.transferId + "/payin", data.body)
}

export const SUBMIT_PAYOUT_INFORMATION = async(data:{
    body:{
        kind: PaymentKind,
        walletId?:number;
        accountNumber?:string;
        routingNumber?:string;
        sortCode?:string;
        BSB?:string;
        IBAN?:string;
        CLABE?:string;
        address?:string;
    },
    transferId: number
})=>{
    console.log(data.body, "body");
    return await transferxpressApi.post("/transfers/" + data.transferId + "/payout", data.body)
}

export const CREATE_QUOTE = async(data:{
    body:{
        amount: string;
        narration: string;
    },
    transferId: number
})=>{
    return await transferxpressApi.post<CreateQuoteDataResponse>("/transfers/" + data.transferId + "/amount", data.body)
}

export const CONFIRM_QUOTE = async(transferId:number)=>{
    return await transferxpressApi.post("/transfers/" + transferId + "/confirm", {})
}
export const GET_TRANSFER_STATUS = async(transferId:number)=>{
    return await transferxpressApi.get<GetTransferStatusDataResponse>("/transfers/" + transferId + "/status")
}
export type PaymentKind = "WALLET_ADDRESS" | "NGN_BANK_TRANSFER" | "USD_BANK_TRANSFER" | "KES_BANK_TRANSFER" | "EUR_BANK_TRANSFER" | "GBP_BANK_TRANSFER" | "MXN_BANK_TRANSFER" | "AUD_BANK_TRANSFER" | "GHS_BANK_TRANSFER";
export type PaymentMethod = {
    kind: PaymentKind,
    fields: string[]
};
type InitiateTransferProcessDataResponse = {
    id: number;
    payinMethods: Array<PaymentMethod>;
    };

type CreateQuoteDataResponse = {
    payin: {
        currencyCode: string;
        amount: string;
        fees: Array<{
            name: "PROCESSING" | "PROVIDER";
            amount: string;
        }>
        paymentInstructions: string;
    },
    payout: {
        currencyCode:string;
        amount: string;
        kind: PaymentKind;
        walletId: number | null;
        accountNumber: string | null;
        routingNumber: string | null;
        sortCode: string | null;
        BSB: string | null;
        IBAN: string | null;
        CLABE: string | null;
        address: string | null;
    }
};

export type TransferStatus = "CREATED" | "PROCESSING" | "SUCCESS" | "FAILED" | "CANCELLED";
type GetTransferStatusDataResponse = {
    status: TransferStatus;
}