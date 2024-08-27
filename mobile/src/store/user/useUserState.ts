import { useSelector } from "react-redux";
import { RootState } from "@/store";

export const useUserState = () => {
  const userState = useSelector(
    (storeState: RootState) => storeState.userReducer
  );
  return userState;
};
