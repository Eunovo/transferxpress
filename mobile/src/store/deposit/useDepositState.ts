import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useDepositState = () => {
  const depositState = useSelector(
    (storeState: RootState) => storeState.depositReducer
  );
  return depositState;
};
