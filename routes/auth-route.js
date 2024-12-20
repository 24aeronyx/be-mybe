const express = require("express");
const router = express.Router();
const {
  register,
  login,
  logout,
  forgotPassword,
  resetPassword,
  deleteAccount,
} = require("../controller/auth-controller");
const {
  registerValidation,
  loginValidation,
} = require("../middleware/auth-validation");

router.post("/register", registerValidation, register);
router.post("/login", loginValidation, login);
router.post("/logout", logout);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.delete("/", deleteAccount)

module.exports = (req, res) => {
  router(req, res);
};
