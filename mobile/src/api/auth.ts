import { transferxpressApi } from "./base";

export const LOGIN_USER = async(data:{
    email:string;
    password: string
})=>{
 return await transferxpressApi.post<LoginUSerDataResponse>("/login", data)
}

export const VERIFY_EMAIL = async(data:{
email:string
}) =>{
    return await transferxpressApi.post("/email-status", data)
};

export const REGISTER_USER = async(data:{
email:string;
firstname:string;
lastname:string;
country: string;
password: string;
phoneNumber: string
})=>{
    return await transferxpressApi.post("/register", data)
}



type LoginUSerDataResponse = {
    token: string
}