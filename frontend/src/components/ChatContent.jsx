import { useContext } from "react";

import { AppContext } from "../appContext";
import femaleUserImg from "../assets/images/defaults/female_user.jpg";

function ChatContent({chatContent, peerUserList}){
		const context = useContext(AppContext);
		const { user: currentUser, baseUrl, generateProfileImageUri } = context;
		let profileImageUrl = baseUrl + "/" + generateProfileImageUri(peerUserList[0].profile_image, peerUserList[0].gender);

    // if(chatContentUserId === currentUserId){
		// console.log(chatContent?.user?._id);

    if(chatContent?.user?._id === currentUser._id.toString()){
        return (
            <div className="text-end mt-2">
                <div className="d-flex justify-content-end align-items-center">
                    <div className="bg-primary text-item">
                        { chatContent.message }
                    </div>
                    
                    {chatContent.endItem && <img src={profileImageUrl} alt="profile" className="chat-user-item-xsm mx-1"/>}
                </div>
            </div>
        );
    }

    const textClass = chatContent.lastItem? "ms-1 bg-secondary text-item" : "ms-4 bg-secondary text-item"
    return (
        <div className="mt-2 d-flex">
            {chatContent.lastItem && <img src={profileImageUrl} alt="profile" className="chat-user-item-xsm mt-1 mx-1"/>}
            <div className={textClass}>
                { chatContent.message }
            </div>
        </div>
    );
}

export default ChatContent;
