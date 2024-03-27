import { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useParams, useSearchParams, useLocation, Link } from "react-router-dom";

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
    const { user, webSocket, baseUrl, generateProfileImageUri } = context;

    const [message, setMessage] = useState("");
    const [chatComponentsState, setChatComponentsState] = useState([]);
    const [peerUserList, setPeerUserList] = useState([]);
    const [chats, setChats] = useState([]);

		const [chatboxType, setChatboxType] = useState("ONE_TO_ONE");
		const [blackListRel, setBlackListRel] = useState(null);

		const [autoScrollState, setAutoScrollState] = useState(true);

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

								// chatContents[i].viewers
								// -> 	a list of user id's who viewed the the current chat item
								// if the current user is NOT included in viewers <Array>
								// ->		add the current user
								if(!chatContents[i].viewers.includes(user._id.toString())){
									// console.log("current user is not included");
								  axios.post(`/api/v1/chat/add-chat-item-viewer/${chatContents[i]._id.toString()}`)
										.then(res => { console.log(res.data); })
										.catch(err => { console.log(err.response); });
								}

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
                // const chatContentUserId = chatContent.user._id;

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
            // axios.post(`/api/v1/send-message/${chatboxId}?userid=${userId}`, { message: message })
            //     .then(res => {
            //         const { chatboxId: newChatboxId } = res.data;

            //         navigate(`/chat/${newChatboxId}`);
            //     })
            //     .catch(err => console.log(err));

						webSocket.send(JSON.stringify({
							type: "message",
							data: {
								chatboxId: null,
								destinationUserId: userId,
								message: message
							}
						}));

            setMessage("");
        }else{
            // const result = await axios.post(`/api/v1/send-message/${chatboxId}?userid=${userId}`, { message: message });
						webSocket.send(JSON.stringify({
							type: "message",
							data: {
								chatboxId: chatboxId,
								message: message
							}
						}));

            setMessage("");
        }
    }

    function handleEnter(event){
        if(event.code === "Enter"){
            sendMessage();
        }
    }

		function unblockUser(userId){
			if(!userId){
				return;
			}

			const formData = {
				sender: user._id.toString(),
				receiver: userId
			}
			
			axios.post(`/api/v1/black-list-rel/delete`, formData)
				.then(res => {
					// console.log(res.data);
					setBlackListRel(null);
				})
				.catch(err => {
					console.log(err?.response?.data);
				});
		}

		// fetch chat members and 'mapChatContents' function only works when 'peerUserList' state is ready 
		useEffect(() => {
			if(chatboxId !== "new"){
				axios.get(`/api/v1/chat/members/${chatboxId}`)
					.then(res => {
							const { chatbox } = res.data;

							if(chatbox && chatbox.type){
								setChatboxType(chatbox.type);
								const { blackListRel: _blackListRel } = res.data;
								setBlackListRel(_blackListRel);
							}

							if(chatbox.users){
								setPeerUserList(chatbox.users);
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
		}, [0]);


		// fetch chat contents
		useEffect(() => {
				if(peerUserList.length !== 0){
					 axios.get(`/api/v1/chat/${chatboxId}/`)
						.then(res => {
								const { chatContents } = res.data;
								chatRef.current = chatContents;
								setChats(chatRef.current);
								// mapChatContents(chatContents, peerUserList);
						})
						.catch(err => console.log(err));
				}
		}, [peerUserList, location, chatboxId]);

    // handle auto scroll
    useEffect(() => {
        // chatMessagesRef.current.scroll(0, chatMessagesRef.current.scrollHeight);
				const body = document.querySelector("body");
				if(autoScrollState){
					window.scroll(0, body.scrollHeight);
					// body.scroll(0, chatMessagesRef.current.scrollHeight);
				}

				return () => {
					window.scroll(0, 0);
				}

				// let lastScrollTop = 0;
				// let count = 0;
				// window.addEventListener('scroll', function() {
				// 	const currentScroll = window.pageYOffset || document.documentElement.scrollTop;

				// 	if (currentScroll > lastScrollTop) {
				// 		// Scroll down
				// 		// console.log("scroll down");
				// 		if(count >= 5 && !autoScrollState){
				// 			setAutoScrollState(true);
				// 		}
				// 	} else {
				// 		// Scroll up
				// 		// console.log("scroll up");
				// 		if(count >= 20 && autoScrollState){
				// 			setAutoScrollState(false);
				// 			count = 0;
				// 		}
				// 		count += 1;
				// 	}
				// 	lastScrollTop = currentScroll <= 0 ? 0 : currentScroll; // For Mobile or negative scrolling
				// });

    }, [chatComponentsState.length]);

    // update ui when new chat contents are created
    useEffect(() => {
        if(chats !== null){
						// console.log(chats);
            mapChatContents(chats, peerUserList);
        }
    }, [chats]);

		useEffect(() => {
			if(webSocket){
				webSocket.onmessage = async (data) => {
					const parsedMessage = JSON.parse(data.data);
					const { viewers, _id } = parsedMessage.data;

					// if new chatbox is just created
					if(parsedMessage?.flags?.newChatboxCreated){
						const { chatboxId: newChatboxId } = parsedMessage.data;
						navigate(`/chat/${newChatboxId}`);
					}

					// if the current user is NOT included in the viewers array
					if(!viewers.includes(user._id.toString())){
						try{
							const result = await axios.post(`/api/v1/chat/add-chat-item-viewer/${_id}`)
							console.log(result);

							const { chatItem } = result.data;
							if(chatItem){
								chatRef.current = [...chatRef.current, chatItem];
								setChats(chatRef.current);
							}
						}catch(error){
							console.log(error);
						}
					}else{
						chatRef.current = [...chatRef.current, parsedMessage.data];
						setChats(chatRef.current);
					}



					// if(!viewers.includes(user._id.toString())){
					// 	try{
					// 		const result = await axios.post(`/api/v1/chat/add-chat-item-viewer/${_id}`)
					// 		// console.log(result);
					// 		const { chatItem } = result.data;
					// 		// console.log(chatItem);
					// 		if(chatItem){
					// 			chatRef.current = [...chatRef.current, chatItem];
					// 			setChats(chatRef.current);
					// 		}
					// 	}catch(error){
					// 		console.log(error);
					// 	}
					// }else{
					// 	chatRef.current = [...chatRef.current, parsedMessage.data];
					// 	setChats(chatRef.current);
					// }

				}
			}
		}, [webSocket]);

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
						<div className="chat-session-banner-ctn fixed-to-app-layout">
							<div className="chat-session-banner pb-1">
									<img src={backIcon} alt="icon" onClick={stepBack} className="custom-icon-xl mx-1 mb-1"/>
									<div className="d-flex justify-content-between mt-1">
											<div className="d-flex align-items-center">
													<Link to={ "/account/" + peerUserList[0]?._id } className="text-decoration-none">
														<img src={generateChatImageUrl(peerUserList)} alt="profile" className="chat-user-item mx-1"/>
													</Link>

													<Link to={ "/account/" + peerUserList[0]?._id } className="text-decoration-none text-dark">
														{ peerUserList.length > 0 &&
															<div className="ms-2">{ peerUserList[0].first_name } { peerUserList[0].last_name }</div> }
													</Link>
											</div>
											<div>
													<img src={phoneIcon} alt={phoneIcon} className="custom-icon-xl mx-1"/>
													<img src={videoCameraIcon} alt={videoCameraIcon} className="custom-icon-xl mx-1"/>
													<img src={infoIcon} alt={infoIcon} className="custom-icon-xl mx-1"/>
											</div>
									</div>
							</div>
						</div>
            <div className="chat-messages-ctn" ref={chatMessagesRef}>
                    { chatComponentsState }
										{ !chatComponentsState.length && <div className="text-center">New chat box</div> }
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

								{ chatboxType === "ONE_TO_ONE" && blackListRel && blackListRel.sender === user._id
									&& <div className="chat-input-layout">
										<div className="chat-input-btn-ctn">
											<button className="link-like-btn text-white"
												onClick={() => unblockUser(blackListRel.receiver)}>
													Unblock this user
											</button>
										</div>
									</div> }

								{ chatboxType === "ONE_TO_ONE" && blackListRel && blackListRel.receiver === user._id
									&& <div className="chat-input-layout">
											<span className="text-white">The user blocked you</span>
										</div> }
								
								{ !blackListRel && <div className="chat-input-layout">
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
                </div> }

            </div>
        </div>
    );
}

export default SingleChat;
