import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TransferState = {
  currency: string;
  amount: string;
  accountName: string;
  accountNumber: string;
  narration: string;
  secondaryUniqueIdentifier?: string
}

const initialState:TransferState = {
    currency: "",
    amount: "",
    accountName: "",
    accountNumber: "",
    narration: ""
};


export const TransferStateSlice =  createSlice({
    name: "TransferState",
    initialState,
    reducers: {
setTransferState: (state, {payload}:PayloadAction<Partial<TransferState>>)=>{
return ( {
    ...state,
    ...payload
})
},
clearTransferState: ()=>initialState
    }
});


export const {
    setTransferState, 
    clearTransferState
} = TransferStateSlice.actions;


export default TransferStateSlice.reducer;