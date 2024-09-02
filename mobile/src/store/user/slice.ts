import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
export type Wallet = {
    id: number;
    ticker: string;
    amount: string
}
type UserState = {
    profile: {
        id: number;
        email: string;
        firstname: string;
        lastname: string;
        country: string;
    } | null;
    wallets: Array<Wallet>;
    activeWallet: Wallet | null
}

const initialState:UserState = {
profile: null,
wallets: [
    {
        id: 2,
        ticker: "USD",
        amount: "4000"
    },
    {
        id: 4,
        ticker: "NGN",
        amount: "400000"
    },
],
activeWallet: null,
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