import { Link, useNavigate } from "react-router-dom";
import { useState, useContext, useEffect } from "react";

import axios from "axios";

import { AppContext } from "../appContext";
import AuthBridge from "../components/AuthBridge";

function AddPhoto(){
	const navigate = useNavigate();
	const context =  useContext(AppContext);
	const { user, storeToken, validateImage, setUser } = context;

	const [formStep, setFormStep] = useState(1);

	const [profileImage, setProfileImage] = useState({
		file: null,
		url: ""
	});
	const [coverImage, setCoverImage] = useState({
		file: null,
		url: ""
	});

	const reader = new FileReader();
	function handleOnChange(event){
		const file = event.target.files[0];
		console.log(file);

		if(!file){
			return;
		}

		// the file type must starts with 'image', eg: image/jpg
		if(!(/^image/.test(file?.type))){
			return;
		}

		reader.onload = () => {

			if(event.target.name === "profile"){
				setProfileImage(prev => {
					return {
						file: file,
						url: reader.result
					};
				});
			}else if(event.target.name === "cover"){
				setCoverImage(prev => {
					return {
						file: file,
						url: reader.result
					};
				});
			}
		}

		reader.readAsDataURL(file);
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
						file: ""
				});
				const { profileImage } = res.data;
				setFormStep(2);
				// user.profile_image = profileImage;
			})
			.catch(err => console.log(err.response));
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
                    file: ""
                });
                // const { coverImage } = res.data;
                // user.cover_image = coverImage;
								navigate("/more-about");
            })
            .catch(err => console.log(err.response));
    }

	function skipForm(){
		// if formStep is 1
		// 	setFormStep to '2'
		// if formStep is 2
		// 	redirect user to '/account'
		if(formStep === 1){
			setFormStep(2);
		}else if(formStep === 2){
			navigate("/more-about");
		}
	}

	// if profile_image is already filled,
	// 	setFormStep to '2'
	// if cover_image is already filled,
	// 	redirect user to '/account'
	useEffect(() => {
		if(user.profile_image){
			setFormStep(2);
		}

		if(user.profile_image && formStep === 2 && user.cover_image){
			navigate("/more-about");
		}
	}, [formStep]);


	return <AuthBridge>
		<div className="cmt-10 auth-layout">
			<div className="add-photo--view">
				<div className="d-flex justify-content-between">
					<button type="button" className="cbtn" onClick={skipForm}>Skip</button>
					<span>{ formStep }/2</span>
				</div>

				{ formStep === 1 && <form>
					<div className="text-center">
						<h3>Upload profile picture</h3>
						<p>Members with photos get more messages</p>
					</div>

					<div>
						{ profileImage.url && <img src={profileImage.url} className="add-photo--front-img"/> }
					</div>

					<div className={ profileImage.url ? "d-flex justify-content-between" : "d-flex justify-content-end" }>
						<div>
							{ profileImage.url && <button type="button" className="cbtn bd-red me-1">Remove</button> }
							<input className="d-none" type="file" name="profile" id="profile-image" onChange={handleOnChange}/>
							<label className="cbtn-bd-green cursor-pointer px-1" htmlFor="profile-image">
								{ profileImage.url ? "Change photo" : "Upload photo" }
							</label>
						</div>

						{ profileImage.url && <button type="button" className="cbtn-bd-green" onClick={updateProfileImage}>Submit</button> }
					</div>
				</form> }

				{ formStep === 2 && <form>
					<div className="text-center">
						<h3>Upload your cover photo</h3>
						<p>Members with photos get more messages</p>
					</div>

					<div>
						{ coverImage.url && <img src={coverImage.url} className="add-photo--front-img"/> }
					</div>

					<div className={ coverImage.url ? "d-flex justify-content-between" : "d-flex justify-content-end" }>
						<div>
							{ coverImage.url && <button type="button" className="cbtn bd-red me-1">Remove</button> }
							<input className="d-none" type="file" name="cover" id="profile-image" onChange={handleOnChange}/>
							<label className="cbtn-bd-green cursor-pointer px-1" htmlFor="profile-image">
								{ coverImage.url ? "Change photo" : "Upload photo" }
							</label>
						</div>

						{ coverImage.url && <button type="button" className="cbtn-bd-green" onClick={updateCoverImage}>Submit</button> }
					</div>
				</form> }

			</div>
		</div>

		</AuthBridge>;
}

export default AddPhoto;
