import { Outlet, Navigate } from "react-router-dom";
import { AppContext } from "../appContext";
import { useEffect, useState, useContext } from "react";

import Loading from "./Loading";

function Auth(){
    const [isLoading, setIsLoading] = useState(true);

    const authData = useContext(AppContext);
    let { user, chatSocket } = authData;

    // check if chatSocket is ready
    useEffect(() => {
        if(Object.keys(chatSocket).length !== 0){
            setIsLoading(false);
        }else{
            setIsLoading(true);
        }
    }, [chatSocket]);

    // redirect unauthorize user from "restrictedRouteList" to "login"
    if(Object.keys(user).length === 0){
        return (
            <Navigate to="/login"/>
        );
    }

    if(!isLoading){
        return (
            <div>
                <Outlet/>
            </div>
        );
    }
    
    return <Loading/>;
}

export default Auth;