import React, { useState } from "react";

const AppContext = React.createContext();

function AppContextProvider(props){
    const auth_data = {
        token: "",
        user: {},
        webSocket: null,
        baseUrl: process.env.REACT_APP_BACKEND_URL,
				webSocketUrl: process.env.REACT_APP_WS_URL
    }
    const [authState, setAuthState] = useState(auth_data);

    function storeToken(token){
        localStorage.setItem('token', token);
        setAuthState(oldState => {
            return {
                ...oldState,
                token: token
            };
        });
    }

    function setUser(authUser){
        setAuthState(oldState => {
            return {
                ...oldState,
                user: authUser
            };
        });
    }

    function setWebSocket(webSocket){
        setAuthState(oldState => {
            return {
                ...oldState,
                webSocket: webSocket
            };
        });
    }

    function logout(){
        localStorage.removeItem('token');
        setAuthState(auth_data);
    }

    function validateImage(filename){
        if(/[a-zA-Z0-9_\[\]]+\.(png)|(jpg)|(jpeg)|(webp)/.test(filename)){
            return true;
        }else{
            return false;
        }
    }

		function generateProfileImageUri(filename, gender){
				if(/[a-zA-Z0-9\[\]]+\.(jpg)|(jpeg)|(webp)/.test(filename)){
            return `user/profileImages/${filename}` 
        }else{
						if(gender === "male"){
							return `user/profileImages/defaults/male_user.jpg`;
						}else if(gender === "female"){
							return `user/profileImages/defaults/female_user.jpg`;
						}else{
							return `user/profileImages/defaults/user.jpg`;
						}
				}
		}

    return (
        <AppContext.Provider value={{...authState, storeToken, setUser, setWebSocket, logout, validateImage, generateProfileImageUri}}>
            {props.children}
        </AppContext.Provider>
    )
}

const AppContextConsumer = AppContext.Consumer;
export { AppContextProvider, AppContextConsumer, AppContext };
