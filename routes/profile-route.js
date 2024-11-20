const express = require("express");
const { getBalance, getProfile } = require("../controller/profile-controller");
const router = express.Router();

router.get('/balance',  getBalance)
router.get('/', getProfile)

module.exports = router