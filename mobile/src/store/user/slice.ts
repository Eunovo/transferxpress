import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export type Wallet = {
    ticker: string;
    amount: string
}
type UserState = {
    profile: null;
    wallets: Array<Wallet>;
    activeWallet: Wallet
}

const initialState:UserState = {
profile: null,
wallets: [
    {
        ticker: "USD",
        amount: "4000"
    },
    {
        ticker: "NGN",
        amount: "4000000"
    },
    {
        ticker: "KES",
        amount: "40000"
    },
],
activeWallet: {
    ticker: "USD",
    amount: "4000"
},
};


export const UserStateSlice =  createSlice({
    name: "UserState",
    initialState,
    reducers: {
setUserState: (state, {payload}:PayloadAction<Partial<UserState>>)=>{
return ( {
    ...state,
    ...payload
})
},
clearUserState: ()=>initialState
    }
});


export const {
   setUserState,
   clearUserState
} = UserStateSlice.actions;


export default UserStateSlice.reducer;