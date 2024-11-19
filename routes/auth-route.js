const express = require("express");
const router = express.Router();
const {register, login} = require("../controller/auth-controller");
const {registerValidation, loginValidation} = require("../middleware/auth-validation");

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login)

module.exports = router;