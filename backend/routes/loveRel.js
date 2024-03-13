const express = require("express");
const router = express.Router();

const { store } = require("../controllers/loveRel");

router.route("/create").post(store);

module.exports = router;
