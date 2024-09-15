import { clearAppState } from "@/store/app/slice";
import { useAppDispatch } from "@/store/hooks"
import { clearSavingsPlanState } from "@/store/savingsPlan/slice";
import { clearTransferState } from "@/store/transfer/slice";
import { clearUserState } from "@/store/user/slice";

export const useLogout = ()=>{
    const dispatch = useAppDispatch();
  const handleLogout = ()=>{
    dispatch(clearAppState())
    dispatch(clearTransferState())
    dispatch(clearSavingsPlanState())
    dispatch(clearUserState())
  }
  return handleLogout
}