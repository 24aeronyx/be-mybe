const express = require("express");
const router = express.Router();
const {register} = require("../controllers/authController");

router.post("/register", registerValidation, register );

module.exports = router;