import { Link, Navigate } from "react-router-dom";
import { useState, useContext } from "react";
import axios from "axios";
import { AppContext } from "../appContext";

import AuthLayout from "../components/AuthLayout";
import SpinningWheel from "../components/SpinningWheel";

function Login(){
    const context =  useContext(AppContext);
    const { user, storeToken } = context;

    const [ userData, setUserData ] = useState({
        email: "",
        username: "",
        password: ""
    });
		const [submitted, setSubmitted] = useState(false);
		const [httpErrorMessage, setHttpErrorMessage] = useState("");
		const [submitting, setSubmitting] = useState(false);

    if(user && Object.keys(user).length !== 0){
        return (
            <Navigate to={`/account/${user._id}`}/>
        );
    }

    function handleChange(event){
        const target = event.target;
        setUserData((prev) => {
            return {
                ...prev,
                [target.name]: target.value
            };
        })
    }

    function submitForm(event){
        event.preventDefault();
				setSubmitted(true);
				
				if(userData.email === "" || userData.password === ""){
					return;
				}

				setSubmitting(true);
        axios.post("/api/auth/login", userData)
            .then(response => {
                const data = response.data;
                const { token } = data;
                storeToken(token);
								setSubmitting(false);
            })
            .catch(error => {
							const { msg } = error.response.data;
							if(msg !== undefined && msg !== null){
								setHttpErrorMessage(msg);
							}
							setSubmitting(false);
						})
    }

    return (<AuthLayout>
            <article>
                <h3 className="text-center">Welcome to New Chat</h3>
                <div>
                    <p className="text-center">Do you have a New Chat account?</p>
                    <form onSubmit={submitForm}>
                        <div className="custom-form-input-ctn">
                            <label className="custom-label">Email</label>
                            <input className="custom-input" name="email" value={userData.email}
                                onChange={handleChange} type="email" placeholder="Email"/>
														{ submitted && userData.email === ""
															&& <small className="text-danger">Email cannot be empty</small> }
                        </div>
                        <div className="custom-form-input-ctn">
                            <label className="custom-label">Password</label>
                            <input className="custom-input" name="password" value={userData.password}
                                onChange={handleChange} type="password" placeholder="Password"/>
														{ submitted && userData.password === ""
															&& <small className="text-danger">Password cannot be empty</small> }
                        </div>
												<div className="c-mt-3">
													<div className="text-end">
															<button className="custom-button-green">Login</button>
													</div>
													<div className="text-center text-danger">
														{ httpErrorMessage !== "" && httpErrorMessage }
													</div>
												</div>
                    </form>
                </div>
                <div className="">
										<span>You don't have an account?</span>
										<Link to="/register" className="ms-1">Register here</Link>
                </div>
            </article>
						{/* <SpinningWheel/> */}
        </AuthLayout>
    );
}

export default Login;
