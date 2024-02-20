import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams, useSearchParams, useLocation } from "react-router-dom";

import axios from "axios";

import backIcon from "../assets/icons/svgs/back.svg";
import phoneIcon from "../assets/icons/svgs/phone.svg";
import videoCameraIcon from "../assets/icons/svgs/video-camera.svg";
import infoIcon from "../assets/icons/svgs/information.svg";
import cameraIcon from "../assets/icons/svgs/camera.svg";
import galleryIcon from "../assets/icons/svgs/gallery.svg";

import { AppContext } from "../appContext";

import ChatContent from "./ChatContent";
import AutoSelectInput from "./AutoSelectInput";

function SingleChat(){
    const context = useContext(AppContext);
    const { user, chatSocket, baseUrl, generateProfileImageUri } = context;

    const [message, setMessage] = useState("");
    const [chatComponentsState, setChatComponentsState] = useState([]);
    const [loading, setLoading] = useState(true);
    const [peerUserList, setPeerUserList] = useState([]);
    const [chats, setChats] = useState([]);

    const navigate = useNavigate();
    const routeParams = useParams();

    const chatboxId = routeParams.id;

    const chatRef = useRef(null);
    const chatMessagesRef= useRef(null);

    const [searchParams] = useSearchParams();
    const userId = searchParams.get("userid");

		const location = useLocation();

    function mapChatContents(chatContents, peerUserList){

        if(chatContents.length !== 0){
            let initBox = chatContents[0];
            let initUserId = initBox.user._id;

            let initBoxDate = new Date(initBox.created_at);
            for(let i = 0; i < chatContents.length; i++){
                const currentboxDate = new Date(chatContents[i].created_at);

                // getTime() returns time in miliseconds, so 1000 * 60 === time in minutes
                let timeGap = (currentboxDate.getTime() - initBoxDate.getTime()) / (1000 * 60);
                timeGap = Math.floor(timeGap);

                if(timeGap >= 3){
                    chatContents[i - 1].lastItem = true;
                    initBoxDate = new Date(chatContents[i].created_at);
                }else{
                    if(i >= 1){
                        chatContents[i - 1].lastItem = false
                    }
                }

                if(initUserId.toString() !== chatContents[i].user._id.toString()){
                    initBox = chatContents[i];
                    initUserId = initBox.user._id;
                    chatContents[i - 1].lastItem = true;
                }

                if(i === chatContents.length - 1){
                    chatContents[i].lastItem = true;
                    chatContents[i].endItem = true;
                }else{
                    chatContents[i].endItem = false;
                }
            }
            
            const chatComponents = chatContents.map((chatContent, index) => {
								// console.log(chatContent?.userId?._id);

                const chatContentUserId = chatContent.user._id;

                return <ChatContent peerUserList={ peerUserList } chatContent={chatContent} key={index}/>
            });

            setChatComponentsState(chatComponents);
        }
    }

    const stepBack = () => {
        navigate(-1);
    }

    function handleMessage(event){
        const target = event.target;
        const value = target.value;
        setMessage(value);
    }

    function sendMessage(){
        if(chatboxId === "new"){
            axios.post(`/api/v1/send-message/${chatboxId}?userid=${userId}`, { message: message })
                .then(res => {
                    const { chatboxId: newChatboxId } = res.data;

                    chatSocket.emit("send-message", {
                    },{
                        userId: userId
                    });

                    navigate(`/chat/${newChatboxId}`);
                })
                .catch(err => console.log(err));

            setMessage("");
        }else{
            // const result = await axios.post(`/api/v1/send-message/${chatboxId}?userid=${userId}`, { message: message });

            chatSocket.emit("send-message", {
                message: message
            },{
                chatboxId: chatboxId,
            });

            setMessage("");
        }
    }

    function handleEnter(event){
        if(event.code === "Enter"){
            sendMessage();
        }
    }

    function hanldeScroll(event){
        if(!loading){
            // console.log(event.target.scrollHeight - event.target.scrollTop);
        }
    }

		// fetch chat members and 'mapChatContents' function only works when 'peerUserList' state is ready 
		useEffect(() => {
					if(chatboxId !== "new"){
							axios.get(`/api/v1/chat/members/${chatboxId}`)
									.then(res => {
											const { users } = res.data;
											if(users !== null && users !== undefined){
													setPeerUserList(users);
											}
									})
									.catch(err => console.log(err));
					}else if(userId !== null){
            axios.get(`/api/v1/chat/users/${userId}`)
                .then(res => {
                    const { user } = res.data;
                    if(user !== null && user !== undefined){
                        setPeerUserList([user]);
                    }
                })
                .catch(err => console.log(err));
        }
		}, []);

    // handle socket.io
    useEffect(() => {
        // chatSocket.on("connect", () => {

            if(chatboxId !== "new"){
                chatSocket.emit("join-room", chatboxId);
            }

            chatSocket.on("receive-message", chatItem => {
                
								console.log(chatItem);
                chatRef.current = [...chatRef.current, chatItem];
                setChats(chatRef.current);

								if(chatItem.user._id !== user._id){
									chatSocket.emit("consume-latest-item");
								}
            });

            setLoading(false);
        // });
               
        return () => {
            console.log("Disconnecting socket room");

            if(chatboxId !== "new"){
                chatSocket.emit("leave-room", chatboxId);
            }
        }
    }, [chatSocket]);

		// fetch chat contents
		useEffect(() => {
				if(peerUserList.length !== 0){
					 axios.get(`/api/v1/chat/${chatboxId}/`)
						.then(res => {
								const { chatContents } = res.data;
								chatRef.current = chatContents;
								mapChatContents(chatContents, peerUserList);
						})
						.catch(err => console.log(err));
				}
		}, [peerUserList, location]);

    // handle auto scroll
    useEffect(() => {
        chatMessagesRef.current.scroll(0, chatMessagesRef.current.scrollHeight);
    }, [chatComponentsState.length]);

    // update ui when new chat contents are created
    useEffect(() => {
        if(chats !== null){
            mapChatContents(chats, peerUserList);
        }
    }, [chats]);

		function generateChatImageUrl(userList){
			if(userList === null || userList === undefined){
				return null;
			}
			if(userList.length === 0){
				return null;
			}

			return baseUrl + "/" + generateProfileImageUri(userList[0].profile_image, userList[0].gender);
		}

    return (
        <div className="chat-app">
            <div className="chat-session-banner fixed-to-app-layout pb-1">
                <img src={backIcon} alt="icon" onClick={stepBack} className="custom-icon-xl mx-1 mb-1"/>
                <div className="d-flex justify-content-between mt-1">
                    <div className="d-flex align-items-center">
                        <img src={generateChatImageUrl(peerUserList)} alt="profile" className="chat-user-item mx-1"/>
                        {
                            peerUserList.length > 0 &&
                            <div className="ms-2">{ peerUserList[0].first_name } { peerUserList[0].last_name }</div>
                        }
                    </div>
                    <div>
                        <img src={phoneIcon} alt={phoneIcon} className="custom-icon-xl mx-1"/>
                        <img src={videoCameraIcon} alt={videoCameraIcon} className="custom-icon-xl mx-1"/>
                        <img src={infoIcon} alt={infoIcon} className="custom-icon-xl mx-1"/>
                    </div>
                </div>
            </div>
            <div className="chat-messages-ctn" ref={chatMessagesRef} onScroll={hanldeScroll}>
                    { chatComponentsState }
                {/* <div className="text-end">
                    <span className="bg-primary text-item">
                        Ziang tuah
                    </span>
                </div>
                <div className="d-flex align-items-center">
                    <img src={femaleUserImg} alt={femaleUserImg} className="chat-user-item-sm mx-1"/>
                    <span className="ms-1 bg-secondary text-item">
                        Ziang hman
                    </span>
                </div>
                <div className="text-end">
                    <span className="bg-primary text-item">
                        Aw
                    </span>
                    <img src={femaleUserImg} alt={femaleUserImg} className="chat-user-item-xsm mx-1"/>
                </div> */}
            </div>
						{/* <div className="chat-input-ctn fixed-to-app-layout"> */}
            <div className="chat-input-ctn">
                <div className="chat-input-layout">
                    <div className="chat-input-btn-ctn ms-2">
                        <img src={cameraIcon} alt={cameraIcon} className="custom-icon chat-input-btn"/>
                    </div>
                    <div className="chat-input-btn-ctn">
                        <img src={galleryIcon} alt={galleryIcon} className="custom-icon chat-input-btn"/>
                    </div>
                    <div className="chat-input-text-ctn">
                        {/* <input type="text" placeholder="Message" className="w-100 chat-input-text" name="message" value={message} onChange={handleMessage} onKeyUp={handleEnter}/> */}
                        <AutoSelectInput cType="text" cPlaceholder="Message" cClass="chat-input-text" cName="message" cValue={message} eChange={handleMessage} eKeyup={handleEnter}/>
                    </div>
                    <div className="chat-input-btn-ctn me-2">
                        <button className="chat-input-send-btn" onClick={sendMessage}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SingleChat;
