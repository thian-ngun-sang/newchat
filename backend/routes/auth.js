const express = require("express");
const { checkRegistrationFormOne, checkRegistrationFormTwo, register, login, validateToken } = require("../controllers/auth");

const router = express.Router();

router.route("/check-registration-form-one").post(checkRegistrationFormOne);
router.route("/check-registration-form-two").post(checkRegistrationFormTwo);
router.route("/register").post(register);
router.route("/login").post(login);
router.route("/validate-token").get(validateToken);

module.exports = router;
