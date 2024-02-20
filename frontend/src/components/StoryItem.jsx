import { Link } from "react-router-dom";

import femaleDefaultProfile from "../assets/images/defaults/female_user.jpg";

function StoryItem(){
    return (
        <li className="mx-2">
            <Link to="/story/1">
                <img className="chat-user-item-lg" src={femaleDefaultProfile}/>
            </Link>
            <h6>Na Na</h6>
        </li>            
    );
}

export default StoryItem;