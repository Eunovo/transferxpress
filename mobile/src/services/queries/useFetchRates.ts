import { GET_MARKET_RATES } from "@/api/rates"
import { useQuery } from "@tanstack/react-query"



export const useFetchRates = (args?:{
    isEnabled?:boolean
})=>{
const {data, isPending} = useQuery({
    queryKey: ["getMarketRates"],
    queryFn: ()=>GET_MARKET_RATES(),
    enabled: args?.isEnabled
});
return({
    rates: data?.data,
    isPending
})
}