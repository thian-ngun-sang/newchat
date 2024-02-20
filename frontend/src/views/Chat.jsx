import { useEffect, useReducer, useContext, useRef } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

import ChatItem from "../components/ChatItem";
// import StoryItem from "../components/StoryItem";

import { AppContext } from "../appContext";

function Chat(){
    const context = useContext(AppContext);
		const { chatSocket } = context;
		const chatboxesRef = useRef(null);

    const initialUsers = {
				chatboxes: [],
				chatboxComponents: []
    };
    const userReducer = (state, action) => {
				if(action.type === "chatboxes"){
					return {
						...state,
						chatboxes: action.value
					};
				}

				if(action.type === "chatboxComponents"){
					return {
							...state,
							chatboxComponents: action.value
					}
				}

        return {
            ...state,
            [action.name]: action.value
        }
    }
    const [usersState, dispatchUsersSate] = useReducer(userReducer, initialUsers);

    function getChatboxes(){
        axios.get("/api/v1/chat")
            .then(res => {
                const { chatBoxes } = res.data;
								chatboxesRef.current = chatBoxes;
								dispatchUsersSate({ type: "chatboxes", value: chatBoxes });
                return res;
            })
            .catch(err => console.log(err))
    }

    useEffect(() => {
        getChatboxes();
    }, []);

    useEffect(() => {

				chatSocket.on("received-latest-message", (chatItem) => {
					const modifiedChatboxes = chatboxesRef.current.map(_chatbox => {

						if(_chatbox._id.toString() === chatItem.chatboxId.toString()){
							const { chatboxId, ..._chatItem } = chatItem;

							return {
								..._chatbox,
								lastMessage: _chatItem
							};
						}

						return _chatbox;
					})

					chatboxesRef.current = modifiedChatboxes;
					dispatchUsersSate({ type: "chatboxes", value: modifiedChatboxes });
				});
    }, [chatSocket]);

		useEffect(() => {
			const chatboxComponents = usersState.chatboxes.map((chatbox, index) => {
					console.log(chatbox);

					if(chatbox.lastMessage !== null){
							return <ChatItem users={chatbox.users} chatboxId={chatbox._id} lastMessage={chatbox.lastMessage} key={index}/>;
					}else{
							return <ChatItem users={chatbox.users} chatboxId={chatbox._id} lastMessage={""} key={index}/>;
					}

			});
			dispatchUsersSate({ type: "chatboxComponents", value: chatboxComponents });
		}, [usersState.chatboxes]);

		// console.log(usersState);

    return (
        <div>
            <div className="chat-navbar">
                <div className="d-flex">
										{/* <img className="custom-icon-xl" src={moreAlignIcon} alt={moreAlignIcon}/>
                    <h5 className="ms-3">Chats</h5> */ }
										<h5>Chats</h5>
                </div>
                <div>
                    <Link to="/chat-users" className="text-decoration-none">
                        <h5 className="ms-3 cursor-pointer">Users</h5>
                    </Link>
                </div>
            </div>
            {/* <div>
                <ul className="user-list mt-3 d-flex">
                    <StoryItem/>
                    <StoryItem/>
                </ul>
            </div> */}
            <div>
                <ul className="user-list mt-3">
                    { usersState.chatboxComponents }
                </ul>
            </div>
        </div>
    );
}

export default Chat;
