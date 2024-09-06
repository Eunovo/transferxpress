import { transferxpressApi } from "./base"
import { PaymentKind } from "./transfer";

export const GET_DEPOSIT_METHODS = async(paths:{
    currency: string
})=>{
    return await transferxpressApi.get("/wallet/" + "15" + "/deposit/" + paths.currency + "/methods")
};

export const INITIATE_DEPOSIT = async(body:{
kind: PaymentKind;
walletId?: number;
cardId?: string;
cardNumber?:string;
cardHolderName?:string;
expiryDate?:string;
cvv?:string;
saveCard?:boolean
})=>{
    return await transferxpressApi.post("/wallet/" + "15" + "/deposit", body)
};

export const SUBMIT_DEPOSIT_INFORMATION = async(body:{
    amount: string
})=>{
    return await transferxpressApi.post("/deposits/" + "15" + "/amount", body)
}

export const CONFIRM_DEPOSIT_QUOTE = async()=>{
    return await transferxpressApi.post("/deposits/" + "15" + "/confirm")
};

export const CANCEL_DEPOSIT_QUOTE = async()=>{
    return await transferxpressApi.post("/deposits/" + "15" + "/cancel")
};

export const GET_DEPOSIT_STATUS = async()=>{
    return await transferxpressApi.get("/deposits/" + "15" + "/status")
}

export const SEND_DEPOSIT_USER_FEEDBACK = async(body:{
    speedOfSettlementRating: number
})=>{
    return await transferxpressApi.post("/deposits/" + "15" + "/feedback")
}