const express = require("express");
const { register, login, validateToken } = require("../controllers/auth");

const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/validate-token").get(validateToken);

module.exports = router;
