import { useContext, useRef, useEffect } from "react";

import { AppContext } from "../appContext";

import { Link } from "react-router-dom";

import axios from "axios";

function AccountOptionOne({currentUser, setCurrentUser, theUserIsTheCurrentUser, accountEllipsisRef, setEditOptionState}){

    const context = useContext(AppContext);
    const { user, setUser, releaseToken } = context;

		const accountOptionRef = useRef(null);

		function mousedownOutsideAccountOption(event){
			if(accountOptionRef.current && !accountOptionRef.current.contains(event.target)
				&& accountEllipsisRef.current && !accountEllipsisRef.current.contains(event.target)){
				// console.log("Clicked outside accountOptionRef and accountEllipsisRef");

				setEditOptionState(false);
				document.removeEventListener("mousedown", mousedownOutsideAccountOption);

			}else if(accountEllipsisRef.current && accountEllipsisRef.current.contains(event.target)){
				// if accountEllipsisRef.current is not null and accountEllipsisRef.current contains target
				document.removeEventListener("mousedown", mousedownOutsideAccountOption);
			}else if(!accountOptionRef.current){
				document.removeEventListener("mousedown", mousedownOutsideAccountOption);
			}
		}

		function blockUser(){
			if(!currentUser?._id){
				return;
			}

			const formData = {
				sender: user._id.toString(),
				receiver: currentUser._id.toString()
			}
			
			axios.post(`/api/v1/black-list-rel/create`, formData)
				.then(res => {
					const { blackListRel } = res.data;

					if(!blackListRel){
						return;
					}

					setCurrentUser(prev => {
						return {
							...prev,
							blackListRel: blackListRel 
						}
					});

					setEditOptionState(false);
					document.removeEventListener("mousedown", mousedownOutsideAccountOption);
				})
				.catch(err => {
					console.log(err?.response?.data);
				});
		}

		function unblockUser(){
			if(!currentUser?._id){
				return;
			}

			const formData = {
				sender: user._id.toString(),
				receiver: currentUser._id.toString()
			}
			
			axios.post(`/api/v1/black-list-rel/delete`, formData)
				.then(res => {
					setCurrentUser(prev => {
						return {
							...prev,
							blackListRel: null
						}
					});

					setEditOptionState(false);
					document.removeEventListener("mousedown", mousedownOutsideAccountOption);
				})
				.catch(err => {
					console.log(err?.response?.data);
				});
		}

		function logout(){
			setUser(null);
			releaseToken();
		}

		useEffect(() => {
				document.addEventListener("mousedown", mousedownOutsideAccountOption);
		});

    return <div className="position-absolute account-option-list" ref={accountOptionRef}>
						{ theUserIsTheCurrentUser && <ul className="custom-list">
								<li>
										<Link className="custom-link" to="/account/edit">Edit Profile</Link>
								</li>
								<li>
										<Link className="custom-link" to="/account/change-password">Change Password</Link>
								</li>
								<li>
										<span className="link-like-btn" onClick={logout}>Logout</span>
								</li>
						</ul> }

						{ !theUserIsTheCurrentUser && <ul className="custom-list">
								{ !currentUser?.blackListRel && <li>
										<span className="link-like-btn" onClick={blockUser}>Block this user</span>
								</li> }

								{ currentUser?.blackListRel && <li>
									{ currentUser?.blackListRel?.sender === user._id &&
										<span className="link-like-btn" onClick={unblockUser}>Unblock this user</span> }
								</li> }

								<li>
										<span className="link-like-btn">Copy user url</span>
								</li>
						</ul> }
        
    </div>
}

export default AccountOptionOne;
