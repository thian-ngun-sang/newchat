const express = require("express");
const { index, show, account, peerAccount, updateAccount, updatePassword, addMoreAboutUser, addBioInfo,
	updateProfileImage, updateCoverImage } = require("../controllers/user");

const { upload } = require("../middlewares/upload");

const router = express.Router();

router.route("/users").get(index);
router.route("/users/:userid").get(show);
router.route("/account").get(account);
router.route("/account/:userid").get(peerAccount);
router.route("/update/account").post(updateAccount);
router.route("/update/password").patch(updatePassword);
router.route("/add-overview-info").post(addMoreAboutUser);
router.route("/add-bio-info").post(addBioInfo);
router.route("/update/profile-image").post(upload.single("profileImage"), updateProfileImage);
router.route("/update/cover-image").post(upload.single("coverImage"), updateCoverImage);

module.exports = router;
