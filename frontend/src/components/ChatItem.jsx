import { Link } from "react-router-dom";
import { useContext } from "react";

import { AppContext } from "../appContext";

function ChatItem({users, chatboxId, lastMessage}){
    const context = useContext(AppContext);

		if(users.length === 0){
			return;
		}
    let user = users[0];
    
    const { baseUrl, validateImage } = context;

		let chatUserProfileUrl;
		
		if(validateImage(user.profile_image)){
			chatUserProfileUrl = `${baseUrl}/user/profileImages/${user.profile_image}`;
		}else{
			if(user.gender === "male"){
				chatUserProfileUrl = `${baseUrl}/user/profileImages/defaults/male_user.jpg`;
			}else if(user.gender === "female"){
				chatUserProfileUrl = `${baseUrl}/user/profileImages/defaults/female_user.jpg`;
			}else{
				chatUserProfileUrl = `${baseUrl}/user/profileImages/defaults/user.jpg`;
			}
		}

    return (
        <li>
            <div className="d-flex my-3 mx-2">
            	<img className="chat-user-item" alt="chat-tem" src={chatUserProfileUrl}/>

							<Link to={ "/chat/" + chatboxId } className="text-decoration-none text-dark">
									<div className="ms-2">
											<small className="d-block">{ user.first_name } { user.last_name }</small>
											<small className="d-block">{ lastMessage.message }</small>
									</div>
							</Link>
							<div className="ms-2">{ user._id }</div>
            </div>
        </li>     
    );
}

export default ChatItem;
