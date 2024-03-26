import { Link } from "react-router-dom";
import { useContext } from "react";

import { AppContext } from "../appContext";

function ChatItem({users, chatboxId, lastMessage}){
    const context = useContext(AppContext);
    const { baseUrl, validateImage, user: currentUser } = context;

		// if the currentUser is included in lastMessage.viewers array
		// -> if have read the lastMessage
		const hadReadLastMessage = lastMessage.viewers.includes(currentUser._id.toString()) ?
			true : false;

		if(users.length === 0){
			return;
		}

    let user = users[0];
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
							<Link to={ "/account/" + user._id } className="text-decoration-none">
								<img className="chat-user-item" alt="chat-tem" src={chatUserProfileUrl}/>
							</Link>

							<Link to={ "/chat/" + chatboxId } className="text-decoration-none text-dark flex-grow-1">
									<div className="ms-2">
											<small className="d-block">{ user.first_name } { user.last_name }</small>
											<small className={ hadReadLastMessage ? 'd-block' : 'd-block chat--new-message'}>
												{ lastMessage.message }
											</small>
									</div>
							</Link>
            </div>
        </li>     
    );
}

export default ChatItem;
