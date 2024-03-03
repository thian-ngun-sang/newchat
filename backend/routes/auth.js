const express = require("express");
const { checkRegistrationFormOne, checkRegistrationFormTwo, sendVerificationEmail, validateEmailVerificationCode,
	register, login, validateToken } = require("../controllers/auth");

const router = express.Router();

router.route("/check-registration-form-one").post(checkRegistrationFormOne);
router.route("/check-registration-form-two").post(checkRegistrationFormTwo);

router.route("/send-verification-email").post(sendVerificationEmail);
router.route("/validate-email-verification-code").post(validateEmailVerificationCode);

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/validate-token").get(validateToken);

module.exports = router;
