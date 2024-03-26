import { useEffect, useState, useContext } from "react";
import { Link, NavLink } from "react-router-dom";

import axios from "axios";

import { calculateAge } from "../utils/index";

import { AppContext } from "../appContext";

import loveDefault from "../assets/icons/svgs/love__solid.svg";
import loveSent from "../assets/icons/svgs/love__sent.svg";
import loveReceived from "../assets/icons/svgs/love__received.svg";
import loveBroken from "../assets/icons/svgs/love__broken.svg";
import loveCouple from "../assets/icons/svgs/love__couple.svg";


import commentIcon from "../assets/icons/svgs/comment__solid.svg";
import img1 from "../assets/images/posts/background05.jpeg";

import { generateProfileImageUri } from "../utils";

function DiscoverUserItem({ _user }){
	const [currentUser, setCurrentUser] = useState(_user);
	const [chatUrlParam, setChatUrlParam] = useState("");

	const context = useContext(AppContext);
	const { user, baseUrl } = context;

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
				console.log(res.data);
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

		function cancelLove(){

			if(!currentUser.loveRel){
				return;
			}

			const formData = {
				sender: currentUser.loveRel.sender,
				receiver: currentUser.loveRel.receiver
			}

			axios.post(`/api/v1/love-rel/delete`, formData)
				.then(res => {
					setCurrentUser(prev => {
						return {
							...prev,
							loveRel: null
						}
					});
				})
				.catch(err => {
					console.log(err?.response?.data);
				});
		}

		function acceptLove(){
			if(!currentUser.loveRel){
				return;
			}

			const formData = {
				sender: currentUser.loveRel.sender,
				receiver: currentUser.loveRel.receiver
			}

			// axios.post(`/api/v1/love-rel/delete`, formData)
			// 	.then(res => {
			// 		setCurrentUser(prev => {
			// 			return {
			// 				...prev,
			// 				loveRel: null
			// 			}
			// 		});
			// 	})
			// 	.catch(err => {
			// 		console.log(err?.response?.data);
			// 	});
		}

	function handleLoveRel(){
			const formData = {
				sender: user._id.toString(),
				receiver: currentUser._id.toString()
			}

			axios.post(`/api/v1/love-rel/create`, formData)
					.then(res => {
						console.log(res.data);
						const { loveRel } = res.data;
						if(!loveRel){
							return;
						}
						currentUser.loveRel = loveRel;
					})
					.catch(err => {
						console.log(err?.response?.data);
					});
	}

	useEffect(() => {
		if(_user){
			setCurrentUser(_user);
		}
	}, []);

	useEffect(() => {
			axios.get(`/api/v1/get-chatbox-id/${ currentUser._id }`)
					.then(res => {
							const { urlParam } = res.data;
							setChatUrlParam(urlParam);
					})
					.catch(err => console.log(err));
	}, []);

	return <div className="ms-1 mb-3">
						<NavLink className="" to={`/account/${currentUser._id}`}>

						<img className="discover--user-list-item-img"
							src={`${baseUrl}/${generateProfileImageUri(currentUser?.profile_image, currentUser?.gender)}`}/>

						</NavLink>
						<div className="d-flex justify-content-between mt-3">
							<div>
								<div>{ currentUser.first_name } { currentUser.last_name } </div>
							</div>

							{/* { !currentUser.loveRel && <div>Send love</div> }
							{ currentUser.loveRel.sender === user._id && currentUser.loveRel.status === "PENDING" && <div>Cancel love</div> }
							{ currentUser.loveRel.receiver === user._id && currentUser.loveRel.status === "PENDING" && <div>Confirm love</div> } */}

							{/* <div>
								{ !currentUser.loveRel && <button className="cbtn" onClick={handleLoveRel}>
									<img src={loveDefault} className="custom-icon-xl"/>
								</button> }

								{ currentUser.loveRel?.sender === user._id && currentUser.loveRel?.status === "PENDING" && 
										<button className="cbtn" title="love request sent">
											<img src={loveSent} className="custom-icon-xl"/>
										</button> }

								{ currentUser.loveRel?.receiver === user._id && currentUser.loveRel?.status === "PENDING" &&
									<button className="cbtn" title="love request received">
											<img src={loveReceived} className="custom-icon-xl"/>
									</button> }

								<Link className="text-decoration-none" to={`/chat/${chatUrlParam}`}>
									<img src={commentIcon} className="custom-icon-xl"/>
								</Link>
							</div> */}

							<Link className="text-decoration-none" to={`/chat/${chatUrlParam}`}>
								<img src={commentIcon} className="custom-icon-xl"/>
							</Link>

						</div>
						<div>
							{ currentUser.dateOfBirth
								? calculateAge(currentUser.dateOfBirth)
								: "20" } • { currentUser.currentLocation
															? `${currentUser.currentLocation.split(",")[0]}, ${currentUser.currentLocation.split(",")[2]}`
															: "London"}
						</div>
						{/* <div className="mt-3 d-flex flex-wrap gap-2">
								{ !currentUser?.loveRel && 
									<span className="link-like-btn outline-btn flex-grow-1" onClick={sendLove}>
										Send Love
									</span> }

								{ currentUser?.loveRel?.sender === user._id.toString() && 
									<span className="link-like-btn outline-btn flex-grow-1" onClick={cancelLove}>
										Cancel Love
									</span> }

								{ currentUser?.loveRel?.receiver === user._id.toString() && 
									<span className="link-like-btn outline-btn flex-grow-1" onClick={acceptLove}>
										Received Love	
									</span> }

								<span className="link-like-btn outline-btn flex-grow-1">
										<Link className="text-decoration-none" to={`/chat/${chatUrlParam}`}>
											Message
										</Link>
								</span>

						</div> */}
				</div>;
}

export default DiscoverUserItem;
