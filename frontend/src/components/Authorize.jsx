import { Outlet, Navigate } from "react-router-dom";
import { AppContext } from "../appContext";
import { useEffect, useState, useContext } from "react";

import Loading from "./Loading";

function Auth(){

    const authData = useContext(AppContext);
    let { user, chatSocket } = authData;

    // redirect unauthorize user from "restrictedRouteList" to "login"
    if(!user || ( user && Object.keys(user).length === 0 )){
        return (
            <Navigate to="/login"/>
        );
    }

		return <Outlet/>
}

export default Auth;
