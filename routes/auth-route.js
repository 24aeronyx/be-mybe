const express = require("express");
const router = express.Router();
const {register, login, logout} = require("../controller/auth-controller");
const {registerValidation, loginValidation} = require("../middleware/auth-validation");

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login)
router.post('/logout', logout)

module.exports = router;