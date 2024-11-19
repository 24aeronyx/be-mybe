const express = require("express");
const { addIncome, addOutcome, getMonthlyReport } = require("../controller/transaction-controller");
const router = express.Router();

router.post('/add-income',  addIncome)
router.post('/add-outcome',  addOutcome)
router.get('/monthly-report',  getMonthlyReport)

module.exports = router