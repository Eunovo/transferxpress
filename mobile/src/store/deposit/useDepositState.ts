import { RootState } from "@/store";
import { useAppSelector } from "../hooks";

export const useDepositState = () => {
  const depositState = useAppSelector(
    (storeState: RootState) => storeState.depositReducer
  );
  return depositState;
};
