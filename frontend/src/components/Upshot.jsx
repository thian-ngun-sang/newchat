import likeIcon from "../assets/icons/svgs/like.svg";
import loveIcon from "../assets/icons/svgs/love__solid.svg";
import sadIcon from "../assets/icons/svgs/sad.svg";
import angryIcon from "../assets/icons/svgs/angry.svg";

import commentIcon from "../assets/icons/svgs/comment.svg";
import shareIcon from "../assets/icons/svgs/share.svg";

function Upshot(){
    return (
        <div className="upshots-layout">
            <span className="text-start ms-2">
                <img className="custom-icon-xl" src={likeIcon} alt={likeIcon}/>
            </span>
            <span className="text-center">
                <img className="custom-icon-xl" src={commentIcon} alt={commentIcon}/>
            </span>
            <span className="text-end me-2">
                <img className="custom-icon-xl" src={shareIcon} alt={shareIcon}/>
            </span>
        </div>
    );
}

export default Upshot;
