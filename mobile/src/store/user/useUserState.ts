import { RootState } from "@/store";
import { useAppSelector } from "../hooks";

export const useUserState = () => {
  const userState = useAppSelector(
    (storeState: RootState) => storeState.userReducer
  );
  return userState;
};
