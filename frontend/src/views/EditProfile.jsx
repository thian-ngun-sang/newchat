import { React, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
// import axios from "axios";

import { AppContext } from "../appContext";

import AuthLayout from "../components/AuthLayout";

import backIcon from "../assets/icons/svgs/back.svg";
import axios from "axios";

function EditProfile(){
    const context =  useContext(AppContext);
    const navigate = useNavigate();
    const { user, setUser, dashSeparatedToCamel, validateLocation } = context;
    
    const [ userData, setUserData ] = useState({
            first_name: user.first_name || "",
            last_name: user.last_name || "",
            user_name: user.user_name || "",
            email: user.email || "",
            phone: user.phone || "",
            gender: user.gender || "",
            currentLocation: user.currentLocation || ""
        });
		const [httpErrorMessage, setHttpErrorMessage] = useState("");
		const [isSubmitted, setIsSubmitted] = useState(false);
        
    function handleOnChange(event){
        const target = event.target;
				let name = dashSeparatedToCamel(event.target.name);
        setUserData((prevState) => {
            return {
                ...prevState,
                [name]: target.value
            };
        })
    }

    function stepBack(){
        navigate(-1);
    }

    function submitForm(event){
        event.preventDefault();

				if(userData.first_name === "" || userData.user_name === "" || userData.email === ""){
					setIsSubmitted(true);
					return;
				}

				// if the location format is not valid
				if(!validateLocation(userData.currentLocation)){
					console.log("Invalid location format");
					return;
				}

				// console.log(userData);
        axios.post("/api/v1/user/update/account", userData)
            .then(res => {
								setIsSubmitted(true);
                const { user: updatedUser } = res.data;
                setUser({
                    ...user,
                    ...updatedUser
                });
                navigate("/account");
            })
            .catch(err => {
							if(err.response === undefined){
								return err;
							}

							const { msg } = err.response.data;
							if(msg !== undefined){
								setHttpErrorMessage(msg);
							}
						});
    }

    return (
        <AuthLayout>
            {/* <button>Back</button> */}
            <img className="custom-icon-xl" onClick={stepBack} alt="back-icon" src={backIcon}/>
            <form onSubmit={submitForm}>
                <div className="custom-input-container">
                    <label className="custom-label">First Name</label>
                    <input className="custom-input" name="first_name"
                        onChange={handleOnChange} value={userData.first_name} type="text" placeholder="First Name"/>
										{	isSubmitted && userData.first_name === ""
											&& <small className="text-danger">Firstname cannot be empty</small> }
                </div>
                <div className="custom-input-container">
                    <label className="custom-label">Lastname</label>
                    <input className="custom-input" name="last_name"
                        onChange={handleOnChange} value={userData.last_name} type="text" placeholder="Lastname"/>
                </div>
                <div className="custom-input-container">
                    <label className="custom-label">Username</label>
                    <input className="custom-input" name="user_name"
                        onChange={handleOnChange} value={userData.user_name} type="text" placeholder="Username"/>
										{	isSubmitted && userData.user_name === ""
											&& <small className="text-danger">Username cannot be empty</small> }
                </div>
                <div className="custom-input-container">
                    <label className="custom-label">Email</label>
                    <input className="custom-input" name="email" value={userData.email}
                        onChange={handleOnChange} type="email" placeholder="Email"/>
										{	isSubmitted && userData.email === ""
											&& <small className="text-danger">Email cannot be empty</small> }

                </div>
                <div className="custom-input-container">
                    <label className="custom-label">Phone</label>
                    <input className="custom-input" name="phone" value={userData.phone}
                        onChange={handleOnChange} type="text" placeholder="Phone"/>
                </div>
                <div className="custom-input-container">
                    <label className="custom-label">Gender</label>
                    <select className="custom-input" name="gender" onChange={handleOnChange} value={userData.gender}>
                        <option value="">Undefined</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                </div>
                <div className="custom-input-container">
                    <label className="custom-label">Address</label>
                    <input className="custom-input" name="current-location" value={userData.currentLocation}
                        onChange={handleOnChange} type="text" placeholder="Country, State, City"/>
                </div>
                <div className="text-end c-mt-3">
                    <button className="custom-button-green">Update</button>
                </div>
								{ httpErrorMessage !== ""
									&& <div className="text-danger">{ httpErrorMessage }</div> }
            </form>
        </AuthLayout>
    );
}

export default EditProfile;
