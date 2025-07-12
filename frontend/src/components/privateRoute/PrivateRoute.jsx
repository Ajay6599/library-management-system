import { useContext } from "react";
import { AuthContext } from "../../context/AuthContextProvider";
import { Navigate } from "react-router-dom";

export const PrivateRoute = ({children}) => {

    let {isAuth} = useContext(AuthContext);

    if(!isAuth) {
        return (
            <Navigate to='/login' />
        );
    }

    return (
        children
    );
};