import { Currencies } from "@/api/rates";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type SavingsPlanState = {
name: string;
fundingCurrency: Currencies,
lockPeriod: string;
savingsAmount: string;
planId?:string
}

const initialState:SavingsPlanState = {
   name: "",
   fundingCurrency: "USD",
   lockPeriod:"",
   savingsAmount:""
};


export const SavingsPlanStateSlice =  createSlice({
    name: "SavingsPlanState",
    initialState,
    reducers: {
setSavingsPlanState: (state, {payload}:PayloadAction<Partial<SavingsPlanState>>)=>{
return ( {
    ...state,
    ...payload
})
},
clearSavingsPlanState: ()=>initialState
    }
});


export const {
    setSavingsPlanState, 
    clearSavingsPlanState
} = SavingsPlanStateSlice.actions;


export default SavingsPlanStateSlice.reducer;