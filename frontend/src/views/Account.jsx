import { useState, useContext, useEffect, useRef } from "react";

import { useNavigate, Link, useParams, useLocation } from "react-router-dom";

import axios from "axios";

import { cmToFeetAndInches, poundsToKilograms, toTitleCase, calculateAge, generateProfileImageUri } from "../utils";

import Loading from "../components/Loading";
import CustomLink from "../components/CustomLink";
import MediaViewer from "../components/MediaViewer";
import AccountOptionOne from "../components/AccountOptionOne";

// import cameraIcon from "../assets/icons/svgs/camera-plus.svg";
import cameraIcon from "../assets/icons/svgs/white-camera.svg";
import moreHorizontalIcon from "../assets/icons/svgs/more-horizontal.svg";
import tickIcon from "../assets/icons/svgs/tick-white2.svg";
import closeIcon from "../assets/icons/svgs/close-md-white.svg"

import statusIcon from "../assets/icons/svgs/status.svg";
import birthdayCakeIcon from "../assets/icons/svgs/birthday-cake.svg";
import rulerIcon from "../assets/icons/svgs/ruler.svg";
import weightIcon from "../assets/icons/svgs/weight.svg";
// import bodyIcon from "../assets/icons/svgs/body.svg";
import likeIcon from "../assets/icons/svgs/like.svg";

// import img1 from "../assets/images/posts/background05.jpeg";

import { AppContext } from "../appContext";

const imageTypes = ["image/jpeg", "image/png"];


function Account(){
    const context = useContext(AppContext);
    const { user, baseUrl } = context;

    const routeParams = useParams();
		const navigate = useNavigate();
    const { id } = routeParams;
    const [chatUrlParam, setChatUrlParam] = useState("");

    const [editOptionState, setEditOptionState] = useState(false);
    const [profileImage, setProfileImage] = useState({
        url: "",
        file: "",
        changedState: false
    });
    const [coverImage, setCoverImage] = useState({
        url: "",
        file: "",
        changedState: false
    });
		const [currentUser, setCurrentUser] = useState(null);
		const [theUserIsTheCurrentUser, setTheUserIsTheCurrentUser] = useState(false);

		const [loveRequestPopupState, setLoveRequestPopupState] = useState(false);
		const [loveSentPopupState, setLoveSentPopupState] = useState(false);
		const [inlovePopupState, setInlovePopupState] = useState(false);

		const [mediaViewer, setMediaViewer] = useState({
			state: false,
			prefix: "",
			itemList: [],
			currentIndex: 0
		});

		// const accountOptionRef = useRef(null);
		const accountEllipsisRef = useRef(null);
		const location = useLocation();

    // const accountOption = (<div className="position-absolute account-option-list" ref={accountOptionRef}>
		// 				{ theUserIsTheCurrentUser && <ul className="custom-list">
		// 						<li>
		// 								<Link className="custom-link" to="/account/edit">Edit Profile</Link>
		// 						</li>
		// 						<li>
		// 								<Link className="custom-link" to="/account/change-password">Change Password</Link>
		// 						</li>
		// 						<li>
		// 								<span className="link-like-btn" onClick={logout}>Logout</span>
		// 						</li>
		// 				</ul> }

		// 				{ !theUserIsTheCurrentUser && <ul className="custom-list">
		// 						{ !currentUser?.blackListRel && <li>
		// 								<span className="link-like-btn" onClick={blockUser}>Block this user</span>
		// 						</li> }

		// 						{ currentUser?.blackListRel && <li>
		// 							{ currentUser?.blackListRel?.sender &&
		// 								<span className="link-like-btn" onClick={unblockUser}>Unblock this user</span> }
		// 						</li> }
		// 				</ul> }
    //     
    // </div>);

    const reader = new FileReader();
    function validateAndSaveImage(arg){
        const file = arg.target.files[0];
        if(file === undefined){
            return undefined;
        }
        if(imageTypes.includes(file.type)){
            reader.readAsDataURL(file);
            return true;
        }else{
            return false;
        }
    }

    function changeCoverImage(event){
        const file = event.target.files[0];

        reader.onload = () => {
            // a function which return a value can also be used
            setCoverImage({
                file: file,
                changedState: true,
                url: reader.result
            });
        }
        
        // let file = validateAndSaveImage(event);
        validateAndSaveImage(event);
        // if(!file){
        //     alert("Invalid file type");
        // }
    }

    function changeProfileImage(event){
        const file = event.target.files[0];

        reader.onload = () => {
            setProfileImage({
                file: file,
                changedState: true,
                url: reader.result
            });
        }
        validateAndSaveImage(event);
        // if(!file){
        //     alert("Invalid file type");
        // }
    }

    function openAccountOption(){
        setEditOptionState(prev => !prev);

				// this function can not have the current value of editOptionState,
				// 		but only it's old state, so the procedure is reversed

				// if(!editOptionState){
				// 	document.addEventListener("mousedown", mousedownOutsideAccountOption);
				// }
    }

    function updateProfileImage(){
        const formData = new FormData();
        formData.append("profileImage", profileImage.file);

        const headers = {
            "Content-Type": "x-www-form-urlencoded",
            "Content-Encoding": "mutipart/form-data"
        }

        axios.post("/api/v1/user/update/profile-image", formData, { headers })
            .then(res => {

                setProfileImage({
                    url: "",
                    file: "",
                    changedState: false
                });

                const { profileImage, profileImages } = res.data;

								const additionalUserInfo = {
									...currentUser.additionalUserInfo,
									profileImages: profileImages && Array.isArray(profileImages) ? profileImages : []
								}

								setCurrentUser(prev => {
									return {
										...prev,
										profile_image: profileImage,
										additionalUserInfo
									}
								});
            })
            .catch(err => console.log(err.response));
    }

    function cancelProfileImageUpdate(){
        setProfileImage({
            url: "",
            file: "",
            changedState: false
        });
    }

    function updateCoverImage(){
        const formData = new FormData();
        formData.append("coverImage", coverImage.file);
        const headers = {
            "Content-Type": "x-www-form-urlencoded",
            "Content-Encoding": "mutipart/form-data"
        }

        axios.post("/api/v1/user/update/cover-image", formData, { headers })
            .then(res => {

                setCoverImage({
                    url: "",
                    file: "",
                    changedState: false
                });
                const { coverImage, coverImages } = res.data;

								const additionalUserInfo = {
									...currentUser.additionalUserInfo,
									coverImages: coverImages && Array.isArray(coverImages) ? coverImages : []
								}
								setCurrentUser(prev => {
									return {
										...prev,
										cover_image: coverImage,
										additionalUserInfo
									}
								});
            })
            .catch(err => console.log(err.response));
    }

    function cancelCoverImageUpdate(){
        setCoverImage({
            url: "",
            file: "",
            changedState: false
        });
    }

    useEffect(() => {
				if(user._id.toString() === id.toString()){
				axios.get(`/api/v1/user/account/${id}`)
						.then(res => {
								const { user } = res.data;
								// console.log(user);

								if(user){
									setCurrentUser(user);
								}
						})
						.catch(err => console.log(err.response));
					setTheUserIsTheCurrentUser(true);
				}else{
					setTheUserIsTheCurrentUser(false);
					axios.get(`/api/v1/user/account/${id}`)
							.then(res => {
									const { user } = res.data;
									// console.log(user);

									if(user){
										setCurrentUser(user);
									}
							})
							.catch(err => console.log(err.response));
				}

    }, [user._id, id]);

    useEffect(() => {
				if(!theUserIsTheCurrentUser){
					axios.get(`/api/v1/get-chatbox-id/${id}`)
							.then(res => {
									const { urlParam } = res.data;
									setChatUrlParam(urlParam);
							})
							.catch(err => console.log(err));
				}
    }, [theUserIsTheCurrentUser, id]);

		// function logout(){
		// 	setUser(null);
		// 	releaseToken();
		// }

		let userCoverImage = currentUser?.cover_image
			? currentUser?.cover_image
			: "defaults/cover_image.jpg";
		let userProfileImage = generateProfileImageUri(currentUser?.profile_image, currentUser?.gender);

		function sendLove(){
			if(!currentUser?._id){
				return;
			}

			const formData = {
				sender: user._id.toString(),
				receiver: currentUser._id.toString()
			}
			
			axios.post(`/api/v1/love-rel/create`, formData)
				.then(res => {
					const { loveRel } = res.data;
					if(!loveRel){
						return;
					}

					setCurrentUser(prev => {
						return {
							...prev,
							loveRel: loveRel
						}
					});
				})
				.catch(err => {
					console.log(err?.response?.data);
				});
		}

		function openLoveRequestPopup(){
			setLoveRequestPopupState(true);
		}
		function closeLoveRequestPopup(){
			setLoveRequestPopupState(false);
		}

		function openLoveSentPoup(){
			setLoveSentPopupState(true);
		}
		function closeLoveSentPoup(){
			setLoveSentPopupState(false);
		}

		function openInlovePopup(){
			setInlovePopupState(true);
		}
		function closeInlovePopup(){
			setInlovePopupState(false);
		}
		
		// return -> { loveRel: {} }
		// throw error
		async function updateLoveRel(loveRel, status){
			if(!loveRel){
				throw new Error("No loveRel found");
			}
			if(status !== "REJECTED" && status !== "ACCEPTED"){
				throw new Error("Invalid love status");
			}

			const formData = {
				sender: loveRel.sender,
				receiver: loveRel.receiver,
				status: status
			}
			try{
				const res = await axios.post(`/api/v1/love-rel/patch`, formData)
				const { loveRel } = res.data;
				if(!loveRel){
					throw new Error("loveRel not returned");
				}
				
				// return an object with key `loveRel`
				return { loveRel };
			}catch(error){
				throw new Error(error);
			}
		}

		function acceptLove(){
			updateLoveRel(currentUser?.loveRel, "ACCEPTED")
				.then(res => {
					const { loveRel } = res;
					if(loveRel){
						setCurrentUser(prev => {
							return {
								...prev,
								loveRel: loveRel 
							}
						});
					}
				})
				.catch(err => {
					console.log(err);
				})
			closeLoveRequestPopup();
		}

		function rejectLove(){
			updateLoveRel(currentUser?.loveRel, "REJECTED")
				.then(res => {
					const { loveRel } = res;
					if(loveRel){
						setCurrentUser(prev => {
							return {
								...prev,
								loveRel: loveRel 
							}
						});
					}
				})
				.catch(err => {
					console.log(err);
				})
			closeLoveRequestPopup();
		}

		async function deleteLoveRel(loveRel){
			if(!loveRel){
				return;
			}

			const formData = {
				sender: loveRel.sender,
				receiver: loveRel.receiver
			}

			try{
				await axios.post(`/api/v1/love-rel/delete`, formData)
			}catch(error){
				console.log(error);
				throw new Error(error);
			}
		}

		// delete a loveRel that the user sent
		async function cancelLoveSent(){
			closeLoveSentPoup();
			try{
				await deleteLoveRel(currentUser?.loveRel);
			}catch(error){
				console.log(error?.response?.data);
			}

			setCurrentUser(prev => {
				return {
					...prev,
					loveRel: null
				}
			});
		}

		// delete a loveRel that the user received
		async function deleteLoveRequest(){
			closeLoveRequestPopup();
			try{
				await deleteLoveRel(currentUser?.loveRel);
			}catch(error){
				console.log(error?.response?.data);
			}

			setCurrentUser(prev => {
				return {
					...prev,
					loveRel: null
				}
			});
		}

		// delete a loveRel which is in ACCEPTED status
		async function deleteInloveRel(){
			closeInlovePopup();
			try{
				await deleteLoveRel(currentUser?.loveRel);
			}catch(error){
				console.log(error?.response?.data);
			}

			setCurrentUser(prev => {
				return {
					...prev,
					loveRel: null
				}
			});
		}

		// function blockUser(){
		// 	if(!currentUser?._id){
		// 		return;
		// 	}

		// 	const formData = {
		// 		sender: user._id.toString(),
		// 		receiver: currentUser._id.toString()
		// 	}
		// 	
		// 	axios.post(`/api/v1/black-list-rel/create`, formData)
		// 		.then(res => {
		// 			const { blackListRel } = res.data;

		// 			if(!blackListRel){
		// 				return;
		// 			}

		// 			console.log(blackListRel);
		// 		})
		// 		.catch(err => {
		// 			console.log(err?.response?.data);
		// 		});
		// }

		// function unblockUser(){
		// 	if(!currentUser?._id){
		// 		return;
		// 	}

		// 	const formData = {
		// 		sender: user._id.toString(),
		// 		receiver: currentUser._id.toString()
		// 	}
		// 	
		// 	axios.post(`/api/v1/black-list-rel/delete`, formData)
		// 		.then(res => {
		// 			setCurrentUser(prev => {
		// 				return {
		// 					...prev,
		// 					blackListRel: null
		// 				}
		// 			});
		// 		})
		// 		.catch(err => {
		// 			console.log(err?.response?.data);
		// 		});
		// }

		function getUserLastProfilePicture(_user){
			if(!Array.isArray(_user?.additionalUserInfo?.profileImages)){
				return;
			}
			if(!_user?.additionalUserInfo?.profileImages.length){
				return;
			}
			return _user.additionalUserInfo.profileImages[_user.additionalUserInfo.profileImages.length - 1];
		}

		function getUserLastCoverPicture(_user){
			if(!Array.isArray(_user?.additionalUserInfo?.coverImages)){
				return;
			}
			if(!_user?.additionalUserInfo?.coverImages.length){
				return;
			}
			return _user.additionalUserInfo.coverImages[_user.additionalUserInfo.coverImages.length - 1];
		}

		function decideTab(){
			if(/photos/.test(location.pathname) && /profile/.test(location.search)){
				return "PROFILE_PHOTOS";
			}
			if(/photos/.test(location.pathname) && /cover/.test(location.search)){
				return "COVER_PHOTOS";
			}
			// if pathname contains 'photos'
			if(/photos/.test(location.pathname)){
				return "PHOTOS";
			}

			return "VITALS";
		}

		function openMediaViewer(_prefix, _itemList, _currentIndex){
			setMediaViewer({
				state: true,
				prefix: _prefix,
				itemList: _itemList,
				currentIndex: _currentIndex
			});
		}

		if(!currentUser){
			return <Loading/>;
		}

		// if(currentUser?.blackListRel?.receiver === user._id.toString()){
		// 	return <div className="app-content pt-5 text-center">
		// 			<h3>This user added you to blacklist</h3>
		// 		</div>;
		// }

    return (
            <div className="app-content">
								{ !theUserIsTheCurrentUser && 
									<div className="mb-1">
										<button className="link-like-btn text-dark" onClick={() => { navigate(-1) }}>Back</button>
									</div> }

                <div className="cover-image-container w-100">
                    <img className="cover-image" alt="cover" 
											src={coverImage.url || `${baseUrl}/user/coverImages/${userCoverImage}`}/>

											{	theUserIsTheCurrentUser && <div className="cover-camera-wrapper position-absolute">
                        { coverImage.changedState
                            ? <>
                                <img className="custom-icon anti-cover-camera" onClick={cancelCoverImageUpdate}
																	alt="close" src={closeIcon}/>
                                <img className="custom-icon cover-camera" onClick={updateCoverImage} alt="tick-icon"
																	src={tickIcon}/>
                            </>
                            : <label>
                                <img className="custom-icon cover-camera" alt="camera-icon" src={cameraIcon}/>
                                <input className="d-none" type="file" onChange={changeCoverImage}/>
                            </label> }
                    </div> }
                </div>
                <div className="profile-banner-layout">
                    <div className="profile-image-container">
                        <div className="profile-image-wrapper">
                            {/* profile image */}
                                <img className="profile-image" alt="profile"
																	src={profileImage.url || `${baseUrl}/${userProfileImage}`}/>

                            {/* close current temporary profile image */}
														
														{ theUserIsTheCurrentUser && <>
															{ profileImage.changedState
																	? <>
																			<img className="custom-icon anti-profile-camera" onClick={cancelProfileImageUpdate}
																				alt="close" src={closeIcon}/>
																			<img className="custom-icon profile-camera" onClick={updateProfileImage} alt="tick-icon"
																				src={tickIcon}/>
																	</>
																	: <label>
																			<img className="custom-icon profile-camera" alt="camera-icon" src={cameraIcon}/>
																			<input className="d-none" type="file" onChange={changeProfileImage}/>
																	</label> }

														</> }
                        </div>
										</div>
										
										<div className="">
											<div className="d-flex gap-2 flex-wrap justify-content-between">
													<div className="mt-3 cms-10 flex-grow-2">
															<h4>{ currentUser?.first_name} { currentUser?.last_name }</h4>
															{/* <span className="d-block">23 • London, Greater London</span> */}
															
														<span className="d-block">
															{currentUser && currentUser.dateOfBirth
																							? calculateAge(currentUser.dateOfBirth)
																							: "23" } • { currentUser && currentUser.currentLocation
																												? `${currentUser.currentLocation.split(",")[0]},
																													${currentUser.currentLocation.split(",")[2]}`
																												: "London, Greater London"}</span>
													</div>

													{ theUserIsTheCurrentUser
														? <div className="text-end position-relative">
																<img className="custom-icon-lg mt-2" ref={accountEllipsisRef}
																	alt="more-horizontal-icon" onClick={openAccountOption}
																	src={moreHorizontalIcon}/>

																{/* { editOptionState && accountOption } */}
																{ editOptionState &&
																		<AccountOptionOne currentUser={currentUser} setCurrentUser={setCurrentUser}
																			theUserIsTheCurrentUser={theUserIsTheCurrentUser}
																			accountEllipsisRef={accountEllipsisRef}
																			setEditOptionState={setEditOptionState}/> }
															</div>
														: <div className="flex-shrink-1">
																<div className="d-flex flex-wrap gap-2 justify-content-end mt-3">

																	{ !currentUser?.loveRel && 
																		<span className="link-like-btn outline-btn flex-grow-1" onClick={sendLove}>
																			Send Love
																		</span> }

																	{ currentUser?.loveRel?.receiver === user._id.toString() && 
																		currentUser?.loveRel?.status === "PENDING" &&
																		<span className="link-like-btn outline-btn flex-grow-1" onClick={openLoveRequestPopup}>
																			Love Received
																		</span> }

																	{ currentUser?.loveRel?.sender === user._id.toString() && 
																		currentUser?.loveRel?.status === "PENDING" &&
																		<span className="me-2 link-like-btn outline-btn flex-grow-1" onClick={openLoveSentPoup}>
																			Love Sent
																		</span> }

																	{ currentUser?.loveRel?.status === "ACCEPTED" &&
																		<span className="link-like-btn outline-btn flex-grow-1" onClick={openInlovePopup}>
																			In Love	
																		</span> }

																	<span className="ps-1 link-like-btn outline-btn flex-grow-1">
																			<Link className="text-decoration-none" to={`/chat/${chatUrlParam}`}>
																				Send Message
																			</Link>
																	</span>

																	<div className="text-end position-relative border px-1">
																		<img className="custom-icon-lg" ref={accountEllipsisRef}
																			alt="more-horizontal-icon" onClick={openAccountOption}
																			src={moreHorizontalIcon}/>

																		{/* { editOptionState && accountOption } */}
																		{ editOptionState &&
																				<AccountOptionOne currentUser={currentUser} setCurrentUser={setCurrentUser}
																					theUserIsTheCurrentUser={theUserIsTheCurrentUser}
																					accountEllipsisRef={accountEllipsisRef}
																					setEditOptionState={setEditOptionState}/> }

																	</div>

																</div>
														</div> }

											</div>

											<div>
												<hr className="mt-4 cmb-1"/>

												{ theUserIsTheCurrentUser
														? <div className="text-end position-relative">
																<img className="custom-icon-lg" alt="more-horizontal-icon" src={moreHorizontalIcon}/>
															</div>
														: <div className="">
															</div> }

												<div className="text-center">"Hey"</div>

												<div className="d-flex gap-3">
													<CustomLink normalClassName="account--tab" activeClassName="account--current-tab" 
														to={"/account/" + currentUser._id}>
															Vitals
													</CustomLink>
													<CustomLink normalClassName="account--tab" activeClassName="account--current-tab" 
														to={"/account/" + currentUser._id + "/photos"}>
															Photos
													</CustomLink>
												</div>

												{ decideTab() === "PHOTOS" &&

													<div className="d-flex flex-wrap gap-3 mt-4 mb-5">

														{ getUserLastProfilePicture(currentUser) && <div>
															<div className="position-relative">

																<Link to={"/account/" + currentUser._id + "/photos?get=profile-pictures"}>
																	<h6 className="position-absolute text-white account--img-text">Profile Pictures</h6>
																	<img className="account--img-list-item" alt="user-img"
																		src={`${baseUrl}/user/profileImages/${getUserLastProfilePicture(currentUser)}`}/>
																</Link>

															</div>
														</div> }

														{ getUserLastCoverPicture(currentUser) && <div>
															<div className="position-relative">

																<Link to={"/account/" + currentUser._id + "/photos?get=cover-pictures"}>
																	<h6 className="position-absolute text-white account--img-text">Cover Pictures</h6>
																	<img className="account--img-list-item" alt="user-img"
																		src={`${baseUrl}/user/coverImages/${getUserLastCoverPicture(currentUser)}`}/>
																</Link>

															</div>
														</div> }
														
													</div>
												}

												{ decideTab() === "PROFILE_PHOTOS" && getUserLastProfilePicture(currentUser) &&

													<div className="d-flex flex-wrap gap-1 mt-4 mb-5">

															{ currentUser?.additionalUserInfo?.profileImages.map((item, index) => {
																return <img className="account--img-list-item cursor-pointer" alt="account-profiles"
																		src={baseUrl + "/user/profileImages/" + item}
																		onClick={() => openMediaViewer("user/profileImages",
																		currentUser?.additionalUserInfo.profileImages, index) }/>;
															}) }

													</div> }

												{ decideTab() === "COVER_PHOTOS" && getUserLastCoverPicture(currentUser) &&

													<div className="d-flex flex-wrap gap-1 mt-4 mb-5">

															{ currentUser?.additionalUserInfo?.coverImages.map((item, index) => {
																return <img className="account--img-list-item cursor-pointer" alt="account-covers"
																	src={baseUrl + "/user/coverImages/" + item}
																	onClick={ () => openMediaViewer(
																		"user/coverImages", currentUser.additionalUserInfo.coverImages, index
																	) }/>;
															}) }

													</div> }

												{ decideTab() === "VITALS" &&
													<div className="mt-3 mb-5">
														<div className="my-2">
															<img className="custom-icon-lg me-3" alt="status" src={statusIcon}/>
															{/* <span>Single Female seeking Males</span> */}
															<span>{ toTitleCase(currentUser?.overviewInfo?.relationshipStatus) }</span>
														</div>

														<div className="my-2">
															<img className="custom-icon-lg me-3" alt="birth-cake" src={birthdayCakeIcon}/>
															{/* <span>23 (Taurus)</span> */}
															{ currentUser && currentUser.dateOfBirth
																		? calculateAge(currentUser.dateOfBirth)
																		: "" }
														</div>

														{ currentUser.bioInfo.height && <div className="my-2">
															<img className="custom-icon-lg me-3" alt="ruler" src={rulerIcon}/>
															<span>
																{ currentUser.bioInfo.height } cm
																({ cmToFeetAndInches(currentUser.bioInfo.height).feet }&apos; 
																{ " " + cmToFeetAndInches(currentUser.bioInfo.height).inches }&quot;)
															</span>
														</div> }

														{ currentUser.bioInfo.weight && <div className="my-2">
															<img className="custom-icon-lg me-3" alt="weight" src={weightIcon}/>
															{/* <span>155 lbs (70kg)</span> */}
															<span>
																{ `${currentUser.bioInfo.weight} lb (${poundsToKilograms(currentUser.bioInfo.weight).toFixed(2)} kg)` }
															</span>
														</div> }

														{/* <div className="my-2">
															<img className="custom-icon-lg me-3" alt="weight" src={bodyIcon}/>
															<span>Average/medium</span>
														</div> */}

														<div className="my-2">
															<img className="custom-icon-lg me-3" alt="like" src={likeIcon}/>
															{/* <span>Whatever Excites Me</span> */}
															<span>{ toTitleCase(currentUser.overviewInfo.sexualOrientation) }</span>
														</div>
													</div>
												}

											</div>
										</div>

								</div>

									{	loveRequestPopupState && <div className="medium-popup">
										<div className="text-end">
											<span className="cursor-pointer" onClick={closeLoveRequestPopup}>X</span>
										</div>

										<div className="">
											<div className="text-center">
												<h5 className="text-center">How do you react to love request</h5>
												<div>from &quot;{ currentUser?.first_name } { currentUser?.last_name }&quot;</div>
											</div>
											<div className="mt-4 mb-2 d-flex flex-wrap justify-content-between gap-1">
												<div className="flex-grow-2">
													<button className="link-like-btn outline-btn" onClick={deleteLoveRequest}>Delete</button>
												</div>

												<div className="flex-grow-1">
													<div className="d-flex gap-1 justify-content-end">
														<button className="link-like-btn outline-btn" onClick={rejectLove}>Reject</button>
														<button className="link-like-btn outline-btn" onClick={acceptLove}>Accept</button>
													</div>
												</div>
											</div>
										</div>
									</div> }

									{	loveSentPopupState && <div className="medium-popup">
										<div className="h-100 d-flex flex-column justify-content-between py-2">
											<div className="text-center">
												<h5 className="text-center">Do you want to cancel love request</h5>
											</div>
											<div className="d-flex justify-content-end">
												<div>
													<button className="link-like-btn outline-btn ms-2" onClick={cancelLoveSent}>Yes</button>
													<button className="link-like-btn outline-btn ms-2" onClick={closeLoveSentPoup}>No</button>
												</div>
											</div>
										</div>
									</div> }

								{	inlovePopupState && <div className="medium-popup">
									<div className="h-100 d-flex flex-column justify-content-between py-2">
										<div className="text-center">
											<h5 className="text-center">Do you want to end this relationship</h5>
										</div>
										<div className="d-flex justify-content-end">
											<div>
												<button className="link-like-btn outline-btn ms-2" onClick={deleteInloveRel}>Yes</button>
												<button className="link-like-btn outline-btn ms-2" onClick={closeInlovePopup}>No</button>
											</div>
										</div>
									</div>
								</div> }

							{ mediaViewer.state && <MediaViewer mediaViewer={mediaViewer} setMediaViewer={setMediaViewer}/> }

						</div>
    );
}

export default Account;
