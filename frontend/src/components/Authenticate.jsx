import { Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../appContext";
import axios from "axios";
import io from 'socket.io-client';

import Loading from "./Loading";

function Authenticate(){
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();

    const auth_data = useContext(AppContext);
    const { setUser, token: globalToken, user: globalUser, setChatSocket, chatSocket: globalChatSocket, validateImage } = auth_data;
    let token = localStorage.getItem('token');

    useEffect(() => {
        // console.log("Authenticate rerun");
        if(token !== "null" && token !== null && token !== "" && token !== undefined){
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
            axios.get('/api/auth/validate-token')
                .then(res => {
                    const { user } = res.data;
                    if(user === undefined){
                        return res;
                    }

                    // check if profile_image is valid like "[12228799.jpg]"
                    if(!validateImage(user.profile_image)){
                        user.profile_image = "defaults/male_user.jpg";
                    }

                    // check if profile_image is valid like "[12228799.jpg]"
                    if(!validateImage(user.cover_image)){
                        user.cover_image = "defaults/cover_image.jpg";
                    }
                    
                    setUser(user); // for context api
                    // Loading is set to false only when chatSocket is ready
                })
                .catch(error => {
                    console.log(error.response);
                    setIsLoading(false);
                })
        }else{
            setIsLoading(false);
        }
    }, [globalToken]);

    useEffect(() => {
        if(Object.keys(globalUser).length !== 0){
            const chatSocket = io(process.env.REACT_APP_BACKEND_URL, {auth: {
                token: token
            }});

            chatSocket.on("connect", () => {
								chatSocket.emit("join-room", globalUser._id.toString());
								console.log(globalUser._id.toString());

                setChatSocket(chatSocket);
            });

            return () => {
                chatSocket.disconnect();
            }
        }
    }, [globalUser, location.pathname]);

    useEffect(() => {
				console.log(globalChatSocket);

        if(Object.keys(globalChatSocket).length !== 0 && Object.keys(globalUser).length !== 0){
            token = localStorage.getItem('token');
            axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;

            setIsLoading(false);
        }
    }, [globalChatSocket]);

    if(isLoading){
        return <Loading/>;
    }

    return <Outlet/>;
}

export default Authenticate;
