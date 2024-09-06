import { transferxpressApi } from "./base"

export const GET_MARKET_RATES = async()=>{
    return await transferxpressApi.get<Rates>("/market-data")
}

type Currencies = string;
// "NGN" | "USD" | "KES" | "EUR" | "GBP" | "MXN" | "AUD"
type CurrencyPair = Record<Currencies, {
    pfiId: number;
    exchangeRate: number;
  }>;
  
export type Rates = Record<Currencies, CurrencyPair>;