const express = require("express");
const { getChatboxId, browseUsers, browseChatBox, getUserInfo, getChatMembers, browseChatContents, sendMessage } = require("../controllers/chatBox");

const router = express.Router();

router.route("/chat/users").get(browseUsers);
router.route("/get-chatbox-id/:id").get(getChatboxId);
router.route("/chat").get(browseChatBox); // list of chatboxes
router.route("/chat/:id").get(browseChatContents); // contents from a single chatbox
router.route("/chat/users/:id").get(getUserInfo); // get user info
router.route("/chat/members/:id").get(getChatMembers); // get user info
router.route("/send-message/:chatboxid").post(sendMessage); // send message or content for a single chatbox

module.exports = router;