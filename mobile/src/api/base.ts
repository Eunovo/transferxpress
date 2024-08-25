import axios, { type AxiosResponse, type AxiosError } from "axios";
import AppConfiguration from "@/config";

export const transferxpressApi = axios.create({
  baseURL: AppConfiguration.apiUrl,
  timeout: 15000,
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
    ? `Bearer ${token}`
    : "";
};

transferxpressApi.interceptors.response.use(
  function (response: AxiosResponse) {
    return response;
  },
//   TODO add interceptor logic
//   function (error: AxiosError<any>) {
    // if (error.response?.status === 401) {
    //   store.dispatch(toggleIsAuthenticated(false));
    // }
    // if (error.code === "ECONNABORTED") {
    //   displayToast({
    //     type: "danger",
    //     message: "Request timed out",
    //   });
    //   return Promise.reject(error);
    // }
    // const errorMessage = `${error.response?.data.message}`;
    // displayToast({
    //   type: "danger",
    //   message: errorMessage,
    // });
    // return Promise.reject(error);
//   }
);

