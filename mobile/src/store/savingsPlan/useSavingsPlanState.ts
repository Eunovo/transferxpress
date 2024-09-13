import { RootState } from "@/store";
import { useAppSelector } from "../hooks";

export const useSavingsPlanState = () => {
  const savingsState = useAppSelector(
    (storeState: RootState) => storeState.savingsPlanReducer
  );
  return savingsState;
};
