import { useEffect, useState } from "react";
import {  FlagType, getAllCountries } from "react-native-country-picker-modal";

export const useFetchCountries = ()=>{

    const [countries, setCountries] = useState<
    Array<{
      id: string;
      value: string;
      callingCode: string | string[]
      icon: string;
    }>
  >([]);
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const res = await getAllCountries(FlagType.FLAT, "common");
        const formatted = res.map((item) => ({
          id: `${item.cca2}`,
          value: `${item.name}`,
          callingCode: item.callingCode,
          icon: item.flag,
        }));
        setCountries(formatted);
      } catch (error) {
        return;
      }
    };
    fetchCountries();
  }, []);

    return countries
}