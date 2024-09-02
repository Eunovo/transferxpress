import { RootState } from "@/store";
import { useAppSelector } from "../hooks";

export const useAppState = () => {
  const appState = useAppSelector(
    (storeState: RootState) => storeState.appReducer
  );
  return appState;
};
