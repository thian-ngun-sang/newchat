import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import axios from "axios"

import AuthLayout from "../components/AuthLayout";

import backIcon from "../assets/icons/svgs/back.svg";

function ChangePassword(){
    const navigate = useNavigate();
    const [ userData, setUserData ] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    });
		const [ isSubmitted, setIsSubmitted ] = useState(false);
		const [ httpErrorMessage, setHttpErrorMessage ] = useState("");

    function handleChange(event){
        const target = event.target;
        setUserData((oldState) => {
            return {
                ...oldState,
                [target.name]: target.value
            };
        })
    }

    function submitForm(event){
        event.preventDefault();
				setIsSubmitted(true);

				if(userData.oldPassword === "" || userData.newPassword === "" || userData.confirmPassword === ""){
					return;
				}

				axios.patch("/api/v1/user/update/password", userData)
					.then(res => {
						// const { msg } = res.data;
						navigate("/account");
					})
					.catch(err => {
						if(err.response === undefined || err.response === null){
							return err;
						}

						const { msg } = err.response.data;
						if(msg !== null && msg !== undefined){
							setHttpErrorMessage(msg);
						}
					})
    }

    const stepBack = () => {
        navigate(-1);
    }

    return (
        <AuthLayout>
            {/* <button>Back</button> */}
            <img src={backIcon} alt={backIcon} onClick={stepBack} className="custom-icon-xl mx-1 mb-1"/>
            <form onSubmit={submitForm}>
                <div className="custom-input-container">
                    <label className="custom-label">Old Password</label>
                    <input className="custom-input" name="oldPassword" value={userData.oldPassword}
                        onChange={handleChange} type="password" placeholder="Old Password"/>
										{ isSubmitted && userData.oldPassword === ""
											&& <small className="text-danger">Old password cannot be null</small> }
                </div>
                <div className="custom-input-container">
                    <label className="custom-label">New Password</label>
                    <input className="custom-input" name="newPassword" value={userData.newPassword}
                        onChange={handleChange} type="password" placeholder="New Password"/>
										{ isSubmitted && userData.newPassword === ""
											&& <small className="text-danger">New password cannot be null</small> }

                </div>
                <div className="custom-input-container">
                    <label className="custom-label">Confirm Password</label>
                    <input className="custom-input" name="confirmPassword" value={userData.confirmPassword}
                        onChange={handleChange} type="password" placeholder="Confirm Password"/>
										{ isSubmitted && userData.confirmPassword === ""
											&& <small className="text-danger">Confirm password cannot be null</small> }
                </div>
                <div className="text-end c-mt-3">
                    <button className="custom-button-green">Update</button>
                </div>
								{ httpErrorMessage !== ""
									&& <div className="text-danger text-center">{ httpErrorMessage }</div> }
            </form>
        </AuthLayout>
    );
}

export default ChangePassword;
