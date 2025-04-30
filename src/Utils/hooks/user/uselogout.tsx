import { useDispatch } from "react-redux";
import { AppDispatch } from "../../../redux/store";
import { logoutUser } from "../../../redux/auth/authSlice";

const useLogout = () => {
    const dispatch = useDispatch<AppDispatch>();
    const LogoutUser = () => {
        dispatch(logoutUser());
      };  
      return { LogoutUser };

}
export default useLogout;