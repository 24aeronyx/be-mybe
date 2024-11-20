const express = require("express");
const { getBalance, getProfile } = require("../controller/profile-controller");
const { authenticateJWT } = require("../middleware/auth");
const router = express.Router();

router.get('/balance', authenticateJWT, getBalance)
router.get('/', authenticateJWT, getProfile)

module.exports = router