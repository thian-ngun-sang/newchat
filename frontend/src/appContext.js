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

		function dashSeparatedToCamel(dashed){
			const dashedInArray = dashed.split("-");
			let res = dashedInArray[0];

			// if dashed was something like "place-of-birth"
			if(dashedInArray.length > 1){
				// start from the second element
				for(let i = 1; i < dashedInArray.length; i++){
					// cast the first character of the current element(string) to uppercase + the rest of the string
					res += dashedInArray[i][0].toUpperCase() + dashedInArray[i].slice(1);
				}
			}

			return res;
		}

		// location should always be in "city, state, country" format
		function validateLocation(recLocation){
			let locationInArray = recLocation.split(",");
			if(locationInArray && locationInArray.length !== 3){
				console.log("Invalid location format");
				return false;
			}

			return true;
		}

		// calculate age based on given date
		function calculateAge(dateOfBirth){
			const dateOfBirthObj = new Date(dateOfBirth);

			var month_diff = Date.now() - dateOfBirthObj;

			//	convert the calculated difference in date format  
			var age_dt = new Date(month_diff);
			//	extract year from date      
			var year = age_dt.getUTCFullYear();  
			//	now calculate the age of the user  
			var age = Math.abs(year - 1970);

			return age;
		}

    return (
        <AppContext.Provider value={{...authState, storeToken, setUser, setWebSocket, logout, validateImage,
						generateProfileImageUri, dashSeparatedToCamel, validateLocation, calculateAge }}>
            {props.children}
        </AppContext.Provider>
    )
}

const AppContextConsumer = AppContext.Consumer;
export { AppContextProvider, AppContextConsumer, AppContext };
