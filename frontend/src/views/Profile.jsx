import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import axios from "axios";

import { AppContext } from "../appContext";

import backIcon from "../assets/icons/svgs/back.svg";
import loveIcon from "../assets/icons/svgs/love__solid.svg";
import moreHorizontalIcon from "../assets/icons/svgs/more-horizontal.svg";

import statusIcon from "../assets/icons/svgs/status.svg";
import birthdayCakeIcon from "../assets/icons/svgs/birthday-cake.svg";
import rulerIcon from "../assets/icons/svgs/ruler.svg";
import weightIcon from "../assets/icons/svgs/weight.svg";
import bodyIcon from "../assets/icons/svgs/body.svg";
import likeIcon from "../assets/icons/svgs/like.svg";

import img1 from "../assets/images/posts/background05.jpeg";

function Profile(){
	const navigate = useNavigate();
	const routeParams = useParams();
	const context = useContext(AppContext);
	const userId = routeParams.id;

	const { calculateAge } = context;

	const [profileUser, setProfileUser] = useState(null);

	function stepBack(){
			navigate(-1);
	}

	useEffect(() => {
		axios.get(`/api/v1/user/users/${userId}`)
			.then(res => {
				const { user } = res.data;
				setProfileUser(user);
			})
			.catch(err => {
				console.log(err.response);
			})
	}, []);

	return <div>
			<div>
				<div>
					<img className="custom-icon-xl" onClick={stepBack} alt="back-icon" src={backIcon}/>
				</div>
				<div className="profile--layout profile--banner mt-4 d-flex">
					<div>
						<img className="profile--user-img" alt="back-icon" src={img1}/>
					</div>
					<div className="ms-4 w-100">
						<div>
							<span className="d-block">{profileUser && profileUser.first_name + profileUser.last_name}</span>
							<span className="d-block">
								{profileUser && profileUser.dateOfBirth
																? calculateAge(profileUser.dateOfBirth)
																: "23" } • { profileUser && profileUser.currentLocation
																					? `${profileUser.currentLocation.split(",")[0]},
																						${profileUser.currentLocation.split(",")[2]}`
																					: "London, Greater London"}</span>
						</div>
						<div className="mt-3 d-flex justify-content-between">
							<div>
								<button className="profile--message-me">
									Message me
								</button>
							</div>
							<div>
								<span>
									<img src={loveIcon} className="custom-icon-xl"/>
								</span>
								<span className="ms-2">
									<img src={moreHorizontalIcon} className="custom-icon-xl"/>
								</span>
							</div>
						</div>
					</div>
				</div>
				<div className="profile--layout profile--body">
					<div>
					</div>
					<div>
						<div className="pt-4">"Hey"</div>
						<hr/>

						<h6>Photos</h6>
						<div className="my-4">
							<img className="profile--user-img-list" alt="user-img" src={img1}/>
						</div>

						<h6>Vitals</h6>
						<div className="my-2">
							<img className="custom-icon-lg me-3" alt="status" src={statusIcon}/>
							<span>Single Female seeking Males</span>
						</div>

						<div className="my-2">
							<img className="custom-icon-lg me-3" alt="birth-cake" src={birthdayCakeIcon}/>
							<span>23 (Taurus)</span>
						</div>

						<div className="my-2">
							<img className="custom-icon-lg me-3" alt="ruler" src={rulerIcon}/>
							<span>5&apos; 4&quot;(163cm)</span>
						</div>

						<div className="my-2">
							<img className="custom-icon-lg me-3" alt="weight" src={weightIcon}/>
							<span>155 lbs (70kg)</span>
						</div>

						<div className="my-2">
							<img className="custom-icon-lg me-3" alt="weight" src={bodyIcon}/>
							<span>Average/medium</span>
						</div>

						<div className="my-2">
							<img className="custom-icon-lg me-3" alt="weight" src={likeIcon}/>
							<span>Whatever Excites Me</span>
						</div>

					</div>
				</div>
			</div>
		</div>;
}

export default Profile;
