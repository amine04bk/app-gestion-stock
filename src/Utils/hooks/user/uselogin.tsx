import { useDispatch, useSelector } from "react-redux";
import { postLoginUser } from "../../../redux/auth/authSlice";
import { LoginValues } from "../../../Interfaces/userInterface";
import { AppDispatch, RootState } from "../../../redux/store";
import { useNotification } from "../../../redux/notifications/usenotification";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const isLoginLoading = useSelector((state: RootState) => state.auth.isLoginLoading);
    const errorLogin = useSelector((state: RootState) => state.auth.errorLogin);
    const userLogin = useSelector((state: RootState) => state.auth.userLogin);
    const loginUser = (values: LoginValues) => {
      dispatch(postLoginUser(values));
    };  
    const { displayNotification } = useNotification();
    useEffect(() => {
      if (isLoginLoading) {
        console.log("loading");
        // Login request is in progress, do nothing
        return;
      }
      if (userLogin) {
        console.log(userLogin);
        // Login request was successful, display success message
        displayNotification({
          message: "Login success",
          type: "success",
        });
        navigate("/")
      }
      if (errorLogin) {
        // Login request resulted in an error, display error message
        displayNotification({
          message: "Error login",
          type: "error",
        });
      }
    }, [isLoginLoading, userLogin, errorLogin, displayNotification]);
  
    return { loginUser, isLoginLoading, errorLogin, userLogin };
  };
  

export default useLogin;