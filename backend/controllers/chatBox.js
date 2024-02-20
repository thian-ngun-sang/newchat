const User = require("../models/User");
const Chatbox = require("../models/Chatbox");
const ChatItem = require("../models/ChatItem");

const getUserInfo = async (req, res) => {
    const params = req.params;
    const { id } = params;
    const user = await User.findById(id, "first_name last_name");

    return res.status(200).json({msg: 'Success', user: user})
}

const getChatMembers = async (req, res) => {
    const params = req.params;
    const { id } = params;
    let users = [];

    const currentUser = req.user;
    let { _id } = currentUser;
    let currentUserId = _id.toString();

    try{
        const chatbox = await Chatbox.findOne({_id: id}).populate("users", "first_name last_name profile_image gender");
        if(chatbox !== null && chatbox !== undefined){
            let { users: userObjectsArray } = chatbox;

            // filter out current user id
            userObjectsArray = userObjectsArray.filter(item => {
                return item._id.toString() !== currentUserId;
            })

            users = userObjectsArray;
        }
    }catch(err){
        console.log(err);
    }

    return res.status(200).json({msg: "Success", users});
}

const getChatboxId = async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    let urlParam = `new?userid=${id}`;
    let chatBox = await Chatbox.findOne({
        $and: [
            {
                "users": {
                    $in: [user._id.toString()]
                }
            },
            {
                "users": {
                    $in: [id]
                }
            }
        ]
    });
    if(chatBox !== null && chatBox.length !== 0){
        urlParam = chatBox._id.toString();
    }
    // console.log(urlParam);

    return res.status(200).json({msg: "Success", urlParam});
}

// list of users except current user
const browseUsers = async (req, res) => {
    const { _id: currentUserId } = req.user;

    const users = await User.find({
        "_id": {
            $ne: currentUserId.toString()
        }
    }, "first_name last_name profile_image gender");

    return res.status(200).json({msg: "Success", users});
}

// list of chatboxes and populate users except the current user
const browseChatBox = async (req, res) => {
    let { _id: currentUserId } = req.user;
   
    let chatBoxes = await Chatbox.find({
        users: {
            $in: [currentUserId]
        }
    }, "-__v -created_at").populate({
        path: "users",
        select: "first_name last_name profile_image gender",
        match: {
            _id: {
                $ne: currentUserId.toString()
            }
        }
    });

    let newChatboxes = [];
    for(let i = 0; i < chatBoxes.length; i++){
        const lastMessage= await ChatItem.findOne({
            chatboxId: chatBoxes[i]._id.toString()
        }, "user message"
        )
        .sort({created_at: -1});

        const newChatbox = {
            _id: chatBoxes[i]._id,
            users: chatBoxes[i].users,
            lastMessage: lastMessage
        }
        newChatboxes.push(newChatbox);
    }

    return res.status(200).json({currentUserId, chatBoxes: newChatboxes});
}

// browse chat contents like messages based on chatboxId
const browseChatContents = async (req, res) => {
    const user = req.user;
    const { id } = req.params;

    // const chatContents = await ChatItem.find({chatboxId: id}).populate("userId", "first_name last_name profile_image gender").populate("user", "first_name last_name profile_image gender");

    const chatContents = await ChatItem.find({chatboxId: id}).populate("user", "first_name last_name profile_image gender");

    return res.status(200).json({msg: "Chat contents", chatContents: chatContents, currentUser: user});
}

const sendMessage = async (req, res) => {
    const { _id: currentUserId } = req.user;
    let { chatboxid: chatboxId } = req.params;

    const body = req.body;
    const { message } = body;

    if(chatboxId === "new"){
        const { userid: userId } = req.query;
        let chatBox = await Chatbox.findOne({
            $and: [
                {
                    "users": {
                        $in: [currentUserId.toString()]
                    }
                },
                {
                    "users": {
                        $in: [userId]
                    }
                }
            ]
        });
        if(chatBox !== null && chatBox.length !== 0){
            chatboxId = chatBox._id.toString();
        }else{
            const newChatbox = await Chatbox.create({users: [currentUserId.toString(), userId]});
            chatboxId = newChatbox._id.toString();
        }
    }

    let chatItem;
    if(message !== "" && message !== null && message !== undefined && chatboxId !== ""){
        let chatItemQuery = {
            chatboxId: chatboxId,
            // userId: currentUserId.toString(),
            user: currentUserId.toString(),
            message: message
        };
        chatItem = await ChatItem.create(chatItemQuery);
    }

    if(req.params.chatboxid === "new"){
        return res.status(200).json({"msg": "Success", "chatboxId": chatboxId, "chatItem": chatItem});
    }
    
    return res.status(200).json({"msg": "Success", "chatItem": chatItem, currentUserId});
}

module.exports = { getChatboxId, browseUsers, browseChatBox, getUserInfo, getChatMembers, browseChatContents, sendMessage };
