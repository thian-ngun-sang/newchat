const express = require("express");

const { index } = require("../controllers/dashboard");

const router = express.Router();

router.route('/').get(index);

module.exports = router;
