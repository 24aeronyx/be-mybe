const express = require("express");
const { getBalance } = require("../controller/profile-controller");
const { authenticateJWT } = require("../middleware/auth");
const router = express.Router();

router.get('/balance', authenticateJWT, getBalance)

module.exports = router