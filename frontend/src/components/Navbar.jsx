import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

import searchIcon from "../assets/icons/svgs/search.svg";
import { useEffect } from "react";

import { AppContext } from "../appContext";

function Navbar(){
    const context = useContext(AppContext);
    const [newChatContents, setNewChatContents] = useState([]);

    useEffect(() => {
        const { user, chatSocket } = context;

				chatSocket.on("received-latest-message", (chatItem) => {
						// console.log(chatItem);

						// new chat(message) sender id
						const chatUserId = chatItem.user.toString();
						// newChatContents => list of user ids who send latest chat messages or contents
						if(!newChatContents.includes(chatUserId) && chatUserId !== user._id.toString()){
								setNewChatContents(prev => {
										let newChatContentsTemp = prev;
										newChatContentsTemp.push(chatUserId);
										return newChatContentsTemp;
								})
						}
				});

    }, []);

    return (
        <div className="app-nav fixed-to-app-layout">
            <div className="my-3 main-nav-layout">
                <NavLink className="custom-nav-item" activeclassname="active" to="/">Home</NavLink>
                <div className="d-flex home-search-ctn">
                    <label htmlFor="home-search" className="bg-success">
                        <img className="custom-icon-lg chat-search-icon" src={searchIcon} alt="search-icon"/>
                    </label>
                    <input type="search" name="q" placeholder="Search" id="home-search" className="w-100 home-search"/>
                </div>
                <NavLink className="custom-nav-item" activeclassname="active" to="/chat">
                    Chat
                    {/* ({newChatContents.length}) */}
                </NavLink>
                <NavLink className="custom-nav-item" activeclassname="active" to="/account">Account</NavLink>
            </div>
        </div>
    );
}

export default Navbar;
