import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useTransferState = () => {
  const transferState = useSelector(
    (storeState: RootState) => storeState.transferReducer
  );
  return transferState;
};
