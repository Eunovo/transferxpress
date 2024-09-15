import { RootState } from "@/store";
import { useAppSelector } from "../hooks";

export const useTransferState = () => {
  const transferState = useAppSelector(
    (storeState: RootState) => storeState.transferReducer
  );
  return transferState;
};
