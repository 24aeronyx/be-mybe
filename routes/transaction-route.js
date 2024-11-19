const express = require("express");
const { addIncome, addOutcome } = require("../controller/transaction-controller");
const { authenticateJWT } = require("../middleware/auth");
const router = express.Router();

router.post('/add-income', authenticateJWT, addIncome)
router.post('/add-outcome', authenticateJWT, addOutcome)

module.exports = router