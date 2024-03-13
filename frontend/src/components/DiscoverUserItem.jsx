import { useEffect, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import axios from "axios";

import { calculateAge } from "../utils/index";

import { AppContext } from "../appContext";

import loveIcon from "../assets/icons/svgs/love__solid.svg";
import commentIcon from "../assets/icons/svgs/comment__solid.svg";
import img1 from "../assets/images/posts/background05.jpeg";

function DiscoverUserItem({ _user }){

	const [chatUrlParam, setChatUrlParam] = useState("");
	const context = useContext(AppContext);
	const { user, baseUrl } = context;

	function handleLoveRel(){
			const formData = {
				sender: user._id.toString(),
				receiver: _user._id.toString()
			}

			axios.post(`/api/v1/love-rel/create`, formData)
					.then(res => {
						console.log(res);
					})
					.catch(err => {
						console.log(err?.response?.data);
					});
	}

	useEffect(() => {
			axios.get(`/api/v1/get-chatbox-id/${ _user._id }`)
					.then(res => {
							const { urlParam } = res.data;
							setChatUrlParam(urlParam);
					})
					.catch(err => console.log(err));
	}, []);

	return <div className="ms-1 mb-3">
						<NavLink className="" to={`/account/${_user._id}`}>
						{ _user.profile_image
							? <img className="discover--user-list-item-img"
									src={`${baseUrl}/user/profileImages/${_user.profile_image}`}/>
							: <img className="discover--user-list-item-img" src={img1}/>
						}
						</NavLink>
						<div className="d-flex justify-content-between mt-3">
							<div>
								<div>{ _user.first_name } { _user.last_name } </div>
							</div>
							<div>
								<button className="cbtn" onClick={handleLoveRel}>
									<img src={loveIcon} className="custom-icon-xl"/>
								</button>
								<Link className="text-decoration-none" to={`/chat/${chatUrlParam}`}>
									<img src={commentIcon} className="custom-icon-xl"/>
								</Link>
							</div>
						</div>
						<div>
							{ _user.dateOfBirth
								? calculateAge(_user.dateOfBirth)
								: "20" } • { _user.currentLocation
															? `${_user.currentLocation.split(",")[0]}, ${_user.currentLocation.split(",")[2]}`
															: "London"}
						</div>
				</div>;
}

export default DiscoverUserItem;
