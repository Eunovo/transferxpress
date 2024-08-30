import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type DepositState = {
  currency: string;
  amount: string;
  exchangeRate: string;
}

const initialState:DepositState = {
    currency:"NGN",
    amount: "",
    exchangeRate: "",
};


export const DepositStateSlice =  createSlice({
    name: "DepositState",
    initialState,
    reducers: {
setDepositState: (state, {payload}:PayloadAction<Partial<DepositState>>)=>{
return ( {
    ...state,
    ...payload
})
},
clearDepositState: ()=>initialState
    }
});


export const {
    setDepositState, 
    clearDepositState
} = DepositStateSlice.actions;


export default DepositStateSlice.reducer;