import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";

import searchIcon from "../assets/icons/svgs/search.svg";
import { useEffect } from "react";

import { AppContext } from "../appContext";

function Navbar(){
    const context = useContext(AppContext);
    const { user, webSocket } = context;
    const [newChatContents, setNewChatContents] = useState([]);

    return (
        <div className="app-nav fixed-to-app-layout">
            <div className="my-3 main-nav-layout">
								<div className="d-flex">
									<NavLink className="text-decoration-none app-logo" to="/">mikchay</NavLink>
									<div className="d-flex home-search-ctn ms-1">
											<label htmlFor="home-search" className="bg-success">
													<img className="custom-icon-lg chat-search-icon" src={searchIcon} alt="search-icon"/>
											</label>
											<input type="search" name="q" placeholder="Search" id="home-search" className="w-100 home-search"/>
									</div>
								</div>
                <NavLink className="custom-nav-item" activeclassname="active" to="/">Home</NavLink>
                <NavLink className="custom-nav-item" activeclassname="active" to="/chat">
                    Chat
                    {/* ({newChatContents.length}) */}
                </NavLink>
                <NavLink className="custom-nav-item" activeclassname="active" to={`/account/${user?._id}`}>Account</NavLink>
            </div>
        </div>
    );
}

export default Navbar;
