import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AppState = {
 token: string | null
}

const initialState:AppState = {
   token: null
};


export const AppStateSlice =  createSlice({
    name: "AppState",
    initialState,
    reducers: {
setAppState: (state, {payload}:PayloadAction<Partial<AppState>>)=>{
return ( {
    ...state,
    ...payload
})
},
clearAppState: ()=>initialState
    }
});


export const {
    setAppState, 
    clearAppState
} = AppStateSlice.actions;


export default AppStateSlice.reducer;