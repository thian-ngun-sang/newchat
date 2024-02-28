const express = require("express");
const { getChatboxId, browseUsers, browseChatBox, getUserInfo, getChatMembers, browseChatContents, sendMessage, addChatItemViewer } = require("../controllers/chatBox");

const router = express.Router();

router.route("/chat/users").get(browseUsers);
router.route("/get-chatbox-id/:id").get(getChatboxId);
router.route("/chat").get(browseChatBox); // list of chatboxes
router.route("/chat/:id").get(browseChatContents); // contents from a single chatbox
router.route("/chat/users/:id").get(getUserInfo); // get user info
router.route("/chat/members/:id").get(getChatMembers); // get user info
router.route("/send-message/:chatboxid").post(sendMessage); // send message or content for a single chatbox
router.route("/chat/add-chat-item-viewer/:id").post(addChatItemViewer); // add user to chat item viewers (list in db)

module.exports = router;
