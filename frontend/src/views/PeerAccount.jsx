import React, { useEffect, useContext } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

import defaultCoverImage from "../assets/images/defaults/cover_image.jpg";

import { AppContext } from "../appContext";

function PeerAccount(){
    const [chatUrlParam, setChatUrlParam] = React.useState("");
		const [user, setUser] = React.useState({});

    const context = useContext(AppContext);
    const { baseUrl, generateProfileImageUri } = context;

    const routeParams = useParams();
    const { id } = routeParams;

    useEffect(() => {
        axios.get(`/api/v1/get-chatbox-id/${id}`)
            .then(res => {
                const { urlParam } = res.data;
                setChatUrlParam(urlParam);
            })
            .catch(err => console.log(err));
    }, []);

		useEffect(() => {
			axios.get(`/api/v1/user/account/${id}`)
				.then(res => {
					const { user } = res.data;
					setUser(user);
				})
				.catch(err => console.log(err.response));
		}, []);

    return (
        <div>
            <div>
                <div className="cover-image-container w-100">
                    <img className="cover-image" alt="cover" src={defaultCoverImage}/>
                </div>
                <div className="profile-banner-layout">
                    <div className="profile-image-container">
												<div className="profile-image-wrapper">
														{/* profile image */}
														<img className="profile-image" alt="profile" src={`${baseUrl}/${generateProfileImageUri(user.profile_image, user.gender)}`}/>
												</div>
                    </div>
                   
										<div className="d-flex justify-content-between">
											<article className="ms-3 mt-3">
													<h4>{ user.first_name } { user.last_name }</h4>
													<ul className="user-details">
															<li>Technological University(Kalay)</li>
															<li>Kalaymyo, Sagaign, Burma</li>
													</ul>
											</article>
											<div className="text-end mt-3">
													<span className="custom-button-green p-1 cursor-pointer">
															<Link className="text-decoration-none" to={`/chat/${chatUrlParam}`}>Send Message</Link>
													</span>
											</div>
										</div>

                </div>
            </div>
        </div>
    );
}

export default PeerAccount;
