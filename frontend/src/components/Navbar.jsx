import { useContext } from "react";
import { NavLink } from "react-router-dom";

import searchIcon from "../assets/icons/svgs/search.svg";
// import { useEffect } from "react";

import { AppContext } from "../appContext";

function Navbar(){
    const context = useContext(AppContext);
    // const { user, webSocket } = context;
    const { user } = context;
    // const [newChatContents, setNewChatContents] = useState([]);

    return (
        <div className="app-nav fixed-to-app-layout">
            <div className="main-nav-layout">
								<div className="d-flex">
									<NavLink className="text-decoration-none app-logo" to="/">mikchay</NavLink>
									<div className="d-flex home-search-ctn ms-2 align-item-center">
											<label htmlFor="home-search" className="chat-search-icon">
													<img className="custom-icon-lg" src={searchIcon} alt="search-icon"/>
											</label>
											<input type="search" name="q" placeholder="Search" id="home-search" className="w-100 home-search"/>
									</div>
								</div>
								<div>
									<NavLink className="custom-nav-item" activeclassname="active" to="/">Home</NavLink>
									<NavLink className="custom-nav-item" activeclassname="active" to="/chat">
											Chat {/* ({newChatContents.length}) */}
									</NavLink>
									<NavLink className="custom-nav-item" activeclassname="account--current-tab" to={`/account/${user?._id}`}>Account</NavLink>
								</div>
            </div>
        </div>
    );
}

export default Navbar;
