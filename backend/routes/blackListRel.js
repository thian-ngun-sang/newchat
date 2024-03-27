const express = require("express");
const router = express.Router();

const { store, destroy } = require("../controllers/blackListRel");

router.route("/create").post(store);
router.route("/delete").post(destroy);

module.exports = router;
