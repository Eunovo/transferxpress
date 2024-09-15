import { PaymentMethod } from "@/api/transfer";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type TransferState = {
  currency: {
    sender: string;
    reciever: string
  };
  amount: string;
  accountName: string;
  accountNumber: string;
  narration: string;
  exchangeRate: string;
  transferId: number | null;
  transferFee?:string;
  payinMethod?:PaymentMethod;
  payoutMethod?: PaymentMethod;
  secondaryUniqueIdentifier?: string
}

const initialState:TransferState = {
    currency:{
        sender: "USD",
        reciever: "KES"
    },
    amount: "",
    accountName: "",
    accountNumber: "",
    exchangeRate: "",
    narration: "",
    transferId: null
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