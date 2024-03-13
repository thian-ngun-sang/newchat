import { useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";

import { validateImage } from "../utils";

import { AppContext } from "../appContext";
import Loading from "./Loading";

function AuthBridge({ children }){
	const [isLoading, setIsLoading] = useState(true);

	const navigate = useNavigate();
	const context =  useContext(AppContext);
	const { user, storeToken, validateImage, setUser } = context;

	useEffect(() => {
    let token = localStorage.getItem('token');
		if(token){
			axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
			axios.get('/api/auth/validate-token')
				.then(res => {
					const { user } = res.data;
					if(user === undefined){
							return res;
					}

					// // check if profile_image is valid like "[12228799.jpg]"
					// if(!validateImage(user.profile_image)){
					// 		user.profile_image = "defaults/male_user.jpg";
					// }

					// // check if profile_image is valid like "[12228799.jpg]"
					// if(!validateImage(user.cover_image)){
					// 		user.cover_image = "defaults/cover_image.jpg";
					// }
					
					setUser(user); // for context api
					setIsLoading(false);
				})
				.catch(error => {
					console.log(error.response);
					setIsLoading(false);
					navigate("/login");
				})
		}else{
			setIsLoading(false);
			navigate("/login");
		}
	}, []);

	if(isLoading){
			return <Loading/>;
	}

	return <>
			{ children }
		</>;
}

export default AuthBridge;
