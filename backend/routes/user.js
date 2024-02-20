const express = require("express");
const { account, peerAccount, updateAccount, updatePassword ,updateProfileImage, updateCoverImage } = require("../controllers/user");

const { upload } = require("../middlewares/upload");

const router = express.Router();

router.route("/account").get(account);
router.route("/account/:userid").get(peerAccount);
router.route("/update/account").post(updateAccount);
router.route("/update/password").patch(updatePassword);
router.route("/update/profile-image").post(upload.single("profileImage"), updateProfileImage);
router.route("/update/cover-image").post(upload.single("coverImage"), updateCoverImage);

module.exports = router;