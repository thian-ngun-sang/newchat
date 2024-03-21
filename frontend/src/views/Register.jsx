import { Link, useNavigate, Navigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";
import axios from "axios";

import { AppContext } from "../appContext";

function Register(){
	const [ userData, setUserData ] = useState({
			first_name: "",
			last_name: "",
			user_name: "",
			email: "",
			gender: "",
			dateOfBirth: "",
			placeOfBirth: "",
			currentLocation: "",
			password: "",
			password2: "",
			confirmationCode: ""
		});
	const [httpErrorMessage, setHttpErrorMessage] = useState("");
	const [submitted, setSubmitted] = useState(false);

	const [deviceLocation, setDeviceLocation] = useState("");
	const [placeOfBirthChoice, setPlaceOfBirthChoice] = useState("MANUAL");
	const [currentLocationChoice, setCurrentLocationChoice] = useState("MANUAL");
	const [locationIsFetching, setLocationIsFetching] = useState(false);

	const context =  useContext(AppContext);
	const { user, storeToken } = context;

	const [formStep, setFormStep] = useState(1);
	const navigate = useNavigate();

	useEffect(() => {
		// getLocation();
	}, []);

	function getVerificationCode(){
		axios.post("/api/auth/send-verification-email", { email: userData.email })
			.then(res => {
				console.log(res.data);
			})
			.catch(err => {
				console.log(err.response);
			})
	}

	useEffect(() => {
		if(placeOfBirthChoice === "GEOLOCATION" && deviceLocation){
			setUserData(prev => {
				return {
					...prev,
					placeOfBirth: deviceLocation
				};
			});
		}

		if(currentLocationChoice === "GEOLOCATION" && deviceLocation){
			setUserData(prev => {
				return {
					...prev,
					currentLocation: deviceLocation
				};
			});
		}
	}, [deviceLocation, placeOfBirthChoice, currentLocationChoice]);

	function handleLocationChoice(event){
		const target = event.target;
		if(target.name !== "birthplace-choice" && target.name !== "currentlocation-choice"){
			return;
		}

		const id = event.target.id;
		let value = id.split("-")[1];
		value = value.toUpperCase();

		if(target.name === "birthplace-choice"){
			setPlaceOfBirthChoice(value);
		}else if(target.name === "currentlocation-choice"){
			setCurrentLocationChoice(value);
		}

		if(value === "GEOLOCATION" && !deviceLocation && !locationIsFetching){
			if (navigator.geolocation) {
				setLocationIsFetching(true);
				navigator.geolocation.getCurrentPosition(showPosition, showError);
			} else {
				console.log("Geolocation is not supported by this browser.");
			}
		}
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

				// check if placeOfBirth is in "city, state, country" format
				if(userData.placeOfBirth){
					let placeOfBirthInArray = userData.placeOfBirth.split(",");
					if(placeOfBirthInArray && placeOfBirthInArray.length !== 3){
						console.log("Invalid location format");
						return;
					}
				}

				// check if placeOfBirth is in "city, state, country" format
				if(userData.currentLocation){
					let currentLocationInArray = userData.currentLocation.split(",");
					if(currentLocationInArray && currentLocationInArray.length !== 3){
						console.log("Invalid location format");
						return;
					}
				}

				axios.post("/api/auth/register", userData)
					.then(response => {
							const { token } = response.data;
							if(token){
								// storeToken(token);
								localStorage.setItem("token", token);
								navigate("/add-photo");
							}
					})
					.catch(error => {
							console.log(error);

							const { msg } = error?.response?.data;
							if(msg !== undefined && msg !== null){
								console.log(msg);
								setHttpErrorMessage(msg);
							}
					})
    }


    function handleOnChange(event){
        const target = event.target;
				const targetNameInArray = target.name.split("-");
				let targetName = targetNameInArray[0];

				// if targetName was something like "place-of-birth"
				if(targetNameInArray.length > 1){

					// start from the second element
					for(let i = 1; i < targetNameInArray.length; i++){
						// cast the first character of the current element(string) to uppercase + the rest of the string
						targetName += targetNameInArray[i][0].toUpperCase() + targetNameInArray[i].slice(1);
					}

				}
				
				if(!targetName){
					return;
				}
				setUserData((prevState) => {
						return {
								...prevState,
								[targetName]: target.value
						};
				})
    }

		function getLocation() {
				if (navigator.geolocation) {
						navigator.geolocation.getCurrentPosition(showPosition, showError);
				} else {
						console.log("Geolocation is not supported by this browser.");
				}
		}

			function showPosition(position) {
				var latitude = position.coords.latitude;
				var longitude = position.coords.longitude;
				const apiKey = 'e1739d49ca944dadabce5dfb29a1054f';

				const apiUrl = `https://api.opencagedata.com/geocode/v1/json?key=${apiKey}&q=${latitude}+${longitude}&pretty=1`;

				fetch(apiUrl)
					.then(response => response.json())
					.then(data => {
						if (data.results && data.results.length > 0) {
							const result = data.results[0];
							const country = result.components.country;
							const state = result.components.state;
							const city = result.components.city || result.components.town;

							// console.log(`Country: ${country}`);
							// if (state) console.log(`State: ${state}`);
							// if (city) console.log(`City: ${city}`);

							setLocationIsFetching(false);
							setDeviceLocation(`${city}, ${state}, ${country}`);
						} else {
							console.error('Unable to retrieve location information.');
						}
					})
					.catch(error => console.error('Error fetching location information:', error));
			}

			function showError(error) {
				switch(error.code) {
					case error.PERMISSION_DENIED:
						console.log("User denied the request for Geolocation.");
						break;
					case error.POSITION_UNAVAILABLE:
						console.log("Location information is unavailable.");
						break;
					case error.TIMEOUT:
						console.log("The request to get user location timed out.");
						break;
					default:
						console.log("An unknown error occurred.");
						break;
				}
			}

		function nextStep(){
			setFormStep(prev => prev + 1);
		}

	function nextFormOne(){
		axios.post("/api/auth/check-registration-form-one", userData)
			.then(response => {
					console.log(response.data);
					setHttpErrorMessage("");
					nextStep();
					// const { token } = response.data;
					// if(token !== null && token !== ""){
					// 		storeToken(token);
					// }
			})
			.catch(error => {
					console.log(error);
					const { msg } = error?.response?.data;
					if(msg !== undefined && msg !== null){
						setHttpErrorMessage(msg);
					}
			})
	}

		function nextFormTwo(){
			axios.post("/api/auth/check-registration-form-two", userData)
				.then(response => {
						console.log(response.data);
						setHttpErrorMessage("");
						getVerificationCode();
						nextStep();
				})
				.catch(error => {
						const { msg } = error.response.data;
						if(msg !== undefined && msg !== null){
							setHttpErrorMessage(msg);
						}
				})
		}

		function prevStep(){
			setFormStep(prev => prev - 1);
		}

		useEffect(() => {
			if(Object.keys(user).length !== 0){
				navigate(`/account/${user._id}`);
			}
		}, []);

    return (
        <div className="mt-5 auth-layout">
            {/* <div></div> */}
            <article>
								{ formStep !== 3 && <h3 className="text-center">Welcome to New Chat</h3> }
                <div>
											{ formStep !== 3 && <p className="text-center">You don't have a New Chat account?</p> }
											<form onSubmit={submitForm}>

												{ formStep === 1 && <div>	
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
												</div> }

												{ formStep === 2 && <div>
													<div className="custom-form-input-ctn mb-2">
															<label className="custom-label">Gender</label>
															<select className="custom-input" name="gender" onChange={handleOnChange}>
																<option value="">Default</option>
																<option value="male">Male</option>
																<option value="female">Female</option>
															</select>
													</div>
													<div className="custom-form-input-ctn mb-2">
															<label className="custom-label">{`Date`} of Birth</label>
															<input className="custom-input" name="date-of-birth" value={userData.dateOfBirth}
																	onChange={handleOnChange} type="date" placeholder="Date of birth"/>
															{ submitted && userData.dateOfBirth === ""
																&& <small className="text-danger">Birthday cannot be empty</small> }
													</div>
													<div className="custom-form-input-ctn mb-2">
															<label className="custom-label">Place of birth</label>
															
															<div>
																<input type="radio" id="birthplace-manual" name="birthplace-choice"
																	checked={placeOfBirthChoice === "MANUAL"} onChange={handleLocationChoice}/>
																<label htmlFor="birthplace-manual" className="ms-1">Manual</label>
																<input type="radio" id="birthplace-geolocation" name="birthplace-choice"
																	checked={placeOfBirthChoice === "GEOLOCATION"} className="ms-3" onChange={handleLocationChoice}/>
																<label htmlFor="birthplace-geolocation" className="ms-1">Device location</label>
															</div>

															<input className="custom-input" name="place-of-birth" value={userData.placeOfBirth}
																	onChange={handleOnChange} type="text" placeholder="City, State, Country"/>
															{ submitted && userData.placeOfBirth === ""
																&& <small className="text-danger">Location cannot be empty</small> }
													</div>
													<div className="custom-form-input-ctn mb-3">
															<label className="custom-label">Current Location</label>
															
															<div>
																<input type="radio" id="currentlocation-manual" name="currentlocation-choice"
																	checked={currentLocationChoice === "MANUAL"} onChange={handleLocationChoice}/>
																<label htmlFor="currentlocation-manual" className="ms-1">Manual</label>
																<input type="radio" id="currentlocation-geolocation" name="currentlocation-choice"
																	checked={currentLocationChoice === "GEOLOCATION"} onChange={handleLocationChoice}
																	className="ms-3"/>
																<label htmlFor="currentlocation-geolocation" className="ms-1">Device {`location`}</label>
															</div>

															<input className="custom-input" name="current-location" value={userData.currentLocation}
																	onChange={handleOnChange} type="text" placeholder="City, State, Country"/>
															{ submitted && userData.currentLocation === ""
																&& <small className="text-danger">Location cannot be empty</small> }
													</div>
												</div> }

												{ formStep === 3 && <div>
													<div className="text-center">
														<h5>Email Confirmation Code</h5>
													</div>
													<p>
														Enter the confirmation code we sent to {`${userData.email}`}.
														<button type="button" className="link-like-btn"
															onClick={getVerificationCode}>Resend Code</button>
													</p>
													<input placeholder="Confirmation Code" name="confirmation-code" onChange={handleOnChange}/>
												</div> }

												{ formStep === 1 && <div className="d-flex justify-content-end c-mt-2">
														<button type="button" onClick={nextFormOne}
															className="custom-button-green">Next</button>
                        </div> }

												{ formStep === 2 && <div className="d-flex justify-content-between c-mt-2">
														<button type="button" onClick={prevStep}
															className="custom-button-green">Prev</button>
														<button type="button" onClick={nextFormTwo} className="custom-button-green">Signup</button>
                        </div> }

												{ formStep === 3 && <div className="d-flex justify-content-end c-mt-2">
														<button className="custom-button-green">Confirm</button>
                        </div> }


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
