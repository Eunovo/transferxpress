import { transferxpressApi } from "./base"
import { Currencies } from "./rates"

export const GET_SAVINGS_PLANS = async()=>{
    return await transferxpressApi.get<GetSavingsPlansDataResponse>("/savings-plans")
}

export const GET_SAVINGS_PLAN_DETAILS = async(savingsPlanId: number)=>{
    return await transferxpressApi.get("/savings-plans/" + savingsPlanId)
}

export const CREATE_SAVINGS_PLAN = async(body:{
    name:string;
    currencyCode: string;
    durationInMonths: number;
})=>{
    return await transferxpressApi.post<SavingsPlan>("/savings-plans", body)
};

export const ACTIVATE_PLAN = async(data:{
    planId:number;
    body:{
        walletId: string;
        amount: string
    }
})=>{
    return await transferxpressApi.post("/savings-plans/" + data.planId + "/auto-fund/enable", data.body)
};

export const ROLL_OVER_PLAN = async(planId:number)=>{
    return await transferxpressApi.post("/savings-plans/" + planId + "/rollover")
}

export type SavingsPlan = {
    id: number;
    name: string;
    currencyCode: Currencies;
    balance: string;
    autoFund: boolean;
    durationInMonths: number;
    startDate: string;
    maturityDate: string;
    state: "ACTIVE" | "MATURED";
    penalties: [{name: "PREMATURE_WITHDRAWAL", percentage: number}]
    };

type GetSavingsPlansDataResponse = Array<SavingsPlan>