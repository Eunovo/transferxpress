import { transferxpressApi } from "./base"

export const GET_USER_PROFILE = async()=>{
    return await transferxpressApi.get<GetUserProfileDataResponse>("profile")
}

export const GET_USER_WALLETS = async()=>{
    return await transferxpressApi.get<GetUserWalletDataResponse>("/wallets")
}

type GetUserWalletDataResponse = Array<{
    id: number;
    currencyCode: string;
    balance: number;
}
>
type GetUserProfileDataResponse = {
    id: number;
    email: string;
    firstname: string;
    lastname: string;
    country: string;
}