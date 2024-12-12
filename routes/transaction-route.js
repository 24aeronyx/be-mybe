const express = require("express");
const {
  addIncome,
  addOutcome,
  getMonthlyReport,
  getHistory,
} = require("../controller/transaction-controller");
const router = express.Router();

router.post("/income", addIncome);
router.post("/outcome", addOutcome);
router.get("/monthly-report", getMonthlyReport);
router.get("/history", getHistory);

module.exports = router;
