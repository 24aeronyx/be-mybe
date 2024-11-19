const express = require("express")
const route = express.Router()
const { registerValidation} = require('../middleware/auth-validation')

module.exports = route