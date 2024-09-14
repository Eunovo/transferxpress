import { transferxpressApi } from "./base"

export const GET_SAVINGS_PLANS = async()=>{
    return await transferxpressApi.get("/savings-plans")
}

export const GET_SAVINGS_PLAN_DETAILS = async(savingsPlanId: number)=>{
    return await transferxpressApi.get("/savings-plans/" + savingsPlanId)
}

export const CREATE_SAVINGS_PLAN = async(body:{
    name:string;
    currencyCode: string;
    durationInMonths: number;
})=>{
    return await transferxpressApi.post("/savings-plans", body)
};

export const ACTIVATE_PLAN = async(data:{
    planId:number;
    body:{
        walletId: number,
        amount: string
    }
})=>{
    return await transferxpressApi.post("/savings-plans/" + data.planId + "/auto-fund/enable", data.body)
};

export const ROLL_OVER_PLAN = async(planId:number)=>{
    return await transferxpressApi.post("/savings-plans/" + planId + "/rollover")
}