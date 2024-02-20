import React, { useContext, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import axios from "axios";

// import cameraIcon from "../assets/icons/svgs/camera-plus.svg";
import cameraIcon from "../assets/icons/svgs/white-camera.svg";
import moreHorizontalIcon from "../assets/icons/svgs/more-horizontal.svg";
import tickIcon from "../assets/icons/svgs/tick-white2.svg";
import closeIcon from "../assets/icons/svgs/close-md-white.svg"

import { AppContext } from "../appContext";

const imageTypes = ["image/jpeg", "image/png"];

function Account(){
    const context = useContext(AppContext);
    const { user, baseUrl  } = context;
    
    const [editOptionState, setEditOptionState] = React.useState(false);
    const [profileImage, setProfileImage] = React.useState({
        url: "",
        file: "",
        changedState: false
    });
    const [coverImage, setCoverImage] = React.useState({
        url: "",
        file: "",
        changedState: false
    });

		const accountOptionRef = useRef(null);

    const accountOption = (<div className="position-absolute account-option-list" ref={accountOptionRef}>
        <ul className="custom-list">
            <li>
                <Link className="custom-link" to="/account/edit">Edit Profile</Link>
            </li>
            <li>
                <Link className="custom-link" to="/account/change-password">Change Password</Link>
            </li>
        </ul>
    </div>);

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

		function mousedownOutsideAccountOption(event){

			if(accountOptionRef.current && !accountOptionRef.current.contains(event.target)){
				console.log("Clicked outside account option")
				if(editOptionState){
					console.log("Edit option state is open");
					setEditOptionState(false);
					document.removeEventListener("mousedown", mousedownOutsideAccountOption);
				}else{
					document.removeEventListener("mousedown", mousedownOutsideAccountOption);
				}

			}else if(!accountOptionRef.current){
				document.removeEventListener("mousedown", mousedownOutsideAccountOption);
			}

		}

    function openAccountOption(){
        setEditOptionState(prevState => !prevState);
    }

		useEffect(() => {
				if(accountOptionRef.current){
					document.addEventListener("mousedown", mousedownOutsideAccountOption);
				}
		}, [accountOptionRef.current, editOptionState]);

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
                const { profileImage } = res.data;
                user.profile_image = profileImage;
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
                const { coverImage } = res.data;
                user.cover_image = coverImage;
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
        axios.get("/api/v1/user/account")
            .then(res => {
                // console.log(res.data)
            })
            .catch(err => console.log(err.response));
    }, []);

    return (
        <div>
            <div>
                <div className="cover-image-container w-100">
                    <img className="cover-image" alt="cover" src={coverImage.url || `${baseUrl}/user/coverImages/${user.cover_image}`}/>

                    <div className="cover-camera-wrapper position-absolute">
                        { coverImage.changedState
                            ? <>
                                <img className="custom-icon anti-cover-camera" onClick={cancelCoverImageUpdate} alt="close" src={closeIcon}/>
                                <img className="custom-icon cover-camera" onClick={updateCoverImage} alt="tick-icon" src={tickIcon}/>
                            </>
                            : <label>
                                <img className="custom-icon cover-camera" alt="camera-icon" src={cameraIcon}/>
                                <input className="d-none" type="file" onChange={changeCoverImage}/>
                            </label> }
                    </div>
                </div>
                <div className="profile-banner-layout">
                    <div className="profile-image-container">
                        <div className="profile-image-wrapper">
                            {/* profile image */}
                                <img className="profile-image" alt="profile" src={profileImage.url || `${baseUrl}/user/profileImages/${user.profile_image}`}/>

                            {/* close current temporary profile image */}
                            { profileImage.changedState
                                ? <>
                                    <img className="custom-icon anti-profile-camera" onClick={cancelProfileImageUpdate} alt="close" src={closeIcon}/>
                                    <img className="custom-icon profile-camera" onClick={updateProfileImage} alt="tick-icon" src={tickIcon}/>
                                </>
                                : <label>
                                    <img className="custom-icon profile-camera" alt="camera-icon" src={cameraIcon}/>
                                    <input className="d-none" type="file" onChange={changeProfileImage}/>
                                </label> }
                        </div>
										</div>
                 
										<div className="d-flex justify-content-between">
												<article className="mt-3 cms-10">
														<h4>{ user.first_name} { user.last_name }</h4>
														<ul className="user-details">
																<li>Technological University(Kalay)</li>
																<li>Kalaymyo, Sagaign, Burma</li>
														</ul>
												</article>
												<div className="text-end position-relative">
														<img className="custom-icon-lg mt-2" alt="more-horizontal-icon" onClick={openAccountOption} src={moreHorizontalIcon}/>
														{ editOptionState && accountOption }
												</div>
										</div>


									</div>
						</div>
        </div>
    );
}

export default Account;
