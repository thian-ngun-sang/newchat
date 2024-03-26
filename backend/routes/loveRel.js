const express = require("express");
const router = express.Router();

const { store, patch, destroy } = require("../controllers/loveRel");

router.route("/create").post(store);
router.route("/patch").post(patch);
router.route("/delete").post(destroy);

module.exports = router;
