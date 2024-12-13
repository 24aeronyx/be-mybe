const express = require("express");
const {
  getBalance,
  getProfile,
  updateProfile,
} = require("../controller/profile-controller");
const updateProfileValidation = require("../middleware/profile-validation");
const router = express.Router();

router.get("/balance", getBalance);
router.get("/", getProfile);
router.put("/", updateProfileValidation, updateProfile);

module.exports = (req, res) => {
  router(req, res);
};
