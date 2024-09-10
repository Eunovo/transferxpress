import axios, { type AxiosResponse, type AxiosError } from "axios";
import AppConfiguration from "@/config";
import { store } from "@/store";
import { setAppState } from "@/store/app/slice";
import { displayFlashbar } from "@/_components/Flashbar/displayFlashbar";

export const transferxpressApi = axios.create({
  baseURL: AppConfiguration.apiUrl,
  timeout: 30000,
  headers: {
    common: {
      Accept: "*/*",
      channel: "MOBILE",
      "Content-Type": "application/json",
    },
  },
});

export const setToken = (token?: string) => {
  transferxpressApi.defaults.headers["Authorization"] = token
    ? `${token}`
    : "";
};

transferxpressApi.interceptors.response.use(
  function (response: AxiosResponse) {
    console.log(response.data);
    
    return response;
  },
  function (error: AxiosError<string>) {
    console.log(error.response?.data);
    
    if (error.response?.status === 401) {
      store.dispatch(setAppState({
        token: null
      }));
    }
    if (error.code === "ECONNABORTED") {
      displayFlashbar({
        type: "danger",
        message: "Request timed out",
      });
      return Promise.reject(error);
    }
const errorResponseData:unknown = error.response?.data;
if(errorResponseData){
  const errorMessage = typeof errorResponseData=== "string"  ? errorResponseData : isCustomError(errorResponseData) ? errorResponseData.data : ``;
  displayFlashbar({
    type: "danger",
    message: errorMessage,
  });
}
    return Promise.reject(error);
  }
);

type CustomError = {code : string; data: string};
function isCustomError (object:unknown): object is CustomError{
if(object === undefined || object === null || typeof object !== "object") return false;
return "code" in object && typeof object.code === "string" && "data" in object && typeof object.data === "string"
}