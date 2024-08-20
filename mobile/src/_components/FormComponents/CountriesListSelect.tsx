import { ListBottomSheet } from "./ListBottomSheet"
import { useEffect, useState } from "react";
import { getAllCountries, FlagType } from "react-native-country-picker-modal";


interface Props {
  title:string;
  placeholder: string;
    value:string;
    onSelect: (value:string)=>void
}
export const CountriesListSelect = (
    {
value,
onSelect,
title,
placeholder,
    }:Props
)=>{
    const [countries, setCountries] = useState<
    Array<{
      id: string;
      value: string;
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
          icon: item.flag,
        }));
        setCountries(formatted);
      } catch (error) {
        return;
      }
    };
    fetchCountries();
  }, []);

    return(
        <ListBottomSheet 
        title={title}
        required
        placeholder={placeholder}
        searchBarPlaceholder="Search for country"
        fieldValue={value}
        options={countries}
        selectItem={(value)=>{
            onSelect(value.value)
        }}
        />
    )
}