import { useEffect, useReducer, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import { AppContext } from "../appContext";

// import moreAlignIcon from "../assets/icons/svgs/align-justify-more.svg";

function ChatUsers(){
		const context = useContext(AppContext);
		const { baseUrl, validateImage } = context;

    const initialUsers = {
        chatUserComponents: []
    };
    const userReducer = (state, action) => {
        return {
            ...state,
            [action.name]: action.value
        }
    }
    const [usersState, dispatchUsersSate] = useReducer(userReducer, initialUsers);

    function getUsers(){
        axios.get("/api/v1/chat/users")
            .then(res => {
                const { users } = res.data;
                const userComponents = users.map((user, index) => {
										let chatUserProfileImageUrl;
										if(validateImage(user.profile_image)){
											chatUserProfileImageUrl = `${baseUrl}/user/profileImages/${user.profile_image}`;
										}else{
											if(user.gender === "male"){
												chatUserProfileImageUrl = `${baseUrl}/user/profileImages/defaults/male_user.jpg`;
											}else if(user.gender === "female"){
												chatUserProfileImageUrl = `${baseUrl}/user/profileImages/defaults/female_user.jpg`;
											}else{
												chatUserProfileImageUrl = `${baseUrl}/user/profileImages/defaults/user.jpg`;
											}
										}

                    return (
                        <div key={index}>
                            <Link to={`/user/${user._id}`} className="d-flex mb-2">
                                <img className="chat-user-item me-2" alt="chat-user" src={chatUserProfileImageUrl}/>
                                <div className="">
                                    <span>{user.first_name} {user.last_name}</span>
                                </div>
                            </Link>
                        </div>
                    );
                });
                dispatchUsersSate({name: "chatUserComponents", value: userComponents});
            })
            .catch(err => console.log(err));
    }

    useEffect(() => {
        getUsers();
    }, []);

    return (
        <div>
            <div className="chat-navbar">
                <div className="d-flex">
									{/* <img className="custom-icon-xl" alt="more-icon" src={moreAlignIcon}/>
                    <Link to="/chat" className="text-decoration-none">
                        <h5 className="ms-3" >Chats</h5>
                    </Link> */ }
										<Link to="/chat" className="text-decoration-none">
                        <h5>Chats</h5>
                    </Link>
                </div>
                <div>
                    <h5 className="ms-3">Users</h5>
                </div>
            </div>
            <div>
                <ul className="user-list mt-3">
                    { usersState.chatUserComponents }
                </ul>
            </div>
        </div>
    );
}

export default ChatUsers;
