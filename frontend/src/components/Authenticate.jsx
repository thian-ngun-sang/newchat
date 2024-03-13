import { Outlet, useLocation } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { AppContext } from "../appContext";
import axios from "axios";

import Loading from "./Loading";

function Authenticate(){
    const [isLoading, setIsLoading] = useState(true);
    const location = useLocation();
    const auth_data = useContext(AppContext);
    const { setUser, setWebSocket, storeToken, webSocket, webSocketUrl, token: globalToken,
			user: globalUser, validateImage } = auth_data;
    let token = localStorage.getItem('token');

    useEffect(() => {
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
                    
										storeToken(token);
                    setUser(user); // for context api
										setIsLoading(false);
                })
                .catch(error => {
										const { msg } = error?.response?.data;
										console.log(msg);
                    setIsLoading(false);
                })
        }else{
            setIsLoading(false);
        }
    }, [globalToken]);

		useEffect(() => {
			if(!webSocket && globalToken){
				try{
					let ws = new WebSocket("ws://172.18.67.12:5000");

					ws.onopen = () => {
						ws.send(JSON.stringify({
							type: "authenticate",
							data: {
								token: globalToken
							}
						}))
						console.log("web socket connected");

						// ws.onmessage = (data) => {
						// 	const parsedMessage = JSON.parse(data.data);
						// 	console.log(parsedMessage);
						// }
					}
					setWebSocket(ws);
				}catch(e){
					console.log(e);
				}
			}
		}, [webSocket, globalToken]);

    if(isLoading){
        return <Loading/>;
    }

    return <Outlet/>;
}

export default Authenticate;
