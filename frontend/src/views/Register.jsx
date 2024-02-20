import { Link, Navigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";

import { AppContext } from "../appContext";

function Register(){
    const [ userData, setUserData ] = useState(
            {
                first_name: "",
                last_name: "",
                user_name: "",
                email: "",
                password: "",
                password2: ""
            });
    const [httpErrorMessage, setHttpErrorMessage] = useState("");
		const [submitted, setSubmitted] = useState(false);
    
    const context =  useContext(AppContext);
    // const { user, storeToken, setUser } = context;
    const { user, storeToken } = context;

    if(Object.keys(user).length !== 0){
        return (
            <Navigate to="/account"/>
        );
    }

    function submitForm(event){
        event.preventDefault();
				setSubmitted(true);
				
				if(userData.first_name === "" || userData.email === "" || userData.password === ""
					|| userData.password2 === ""){
					return;
				}

        if(userData.password !== userData.password2){
						setHttpErrorMessage("Passwords do not match");
						return;
        }

				axios.post("/api/auth/register", userData)
					.then(response => {
							console.log(response.data);
							const { token } = response.data;
							if(token !== null && token !== ""){
									storeToken(token);
							}
					})
					.catch(error => {
							const { msg } = error.response.data;
							if(msg !== undefined && msg !== null){
								setHttpErrorMessage(msg);
							}
					})
    }

    function handleOnChange(event){
        const target = event.target;
        setUserData((prevState) => {
            return {
                ...prevState,
                [target.name]: target.value
            };
        })
    }

    return (
        <div className="mt-5 auth-layout">
            {/* <div></div> */}
            <article>
                <h3 className="text-center">Welcome to New Chat</h3>
                <div>
                    <p className="text-center">You don't have a New Chat account?</p>

                    <form onSubmit={submitForm}>
                        <div className="custom-form-input-ctn">
                            <label className="custom-label">Firstname</label>
                            <input className="custom-input" name="first_name"
                                onChange={handleOnChange} value={userData.first_name} type="text" placeholder="First Name"/>
														{ submitted && userData.first_name === ""
															&& <small className="text-danger">Firstname cannot be empty</small> }
                        </div>
                        <div className="custom-form-input-ctn">
                            <label className="custom-label">Lastname</label>
                            <input className="custom-input" name="last_name"
                                onChange={handleOnChange} value={userData.last_name} type="text" placeholder="Last Name"/>
                        </div>
                        <div className="custom-form-input-ctn">
                            <label className="custom-label">Email</label>
                            <input className="custom-input" name="email" value={userData.email}
                                onChange={handleOnChange} type="email" placeholder="Email"/>
														{ submitted && userData.email === ""
															&& <small className="text-danger">Email cannot be empty</small> }
                        </div>
                        <div className="custom-form-input-ctn">
                            <label className="custom-label">Password</label>
                            <input className="custom-input" name="password" value={userData.password}
                                onChange={handleOnChange} type="password" placeholder="Password"/>
														{ submitted && userData.password === ""
															&& <small className="text-danger">Password cannot be empty</small> }
                        </div>
                        <div className="custom-form-input-ctn">
                            <label className="custom-label">Confirm Password</label>
                            <input className="custom-input" name="password2" value={userData.password2}
                                onChange={handleOnChange} type="password" placeholder="Confirm Password"/>
														{ submitted && userData.password2 === ""
															&& <small className="text-danger">Confirm Password cannot be empty</small> }
                        </div>
                        <div className="text-end c-mt-2">
                            <button className="custom-button-green">Register</button>
                        </div>
												<div className="text-danger text-center">
														{ httpErrorMessage !== "" && httpErrorMessage }
												</div>
                    </form>
                </div>
                <div className="">
										<span>You have an account?</span>
										<Link to="/login" className="ms-1">Login here</Link>
                </div>
                {/* <div></div> */}
            </article>
        </div>
    );
}

export default Register;
