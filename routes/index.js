const express = require("express")
const route = express.Router()
const authRoute = require('../routes/auth-route')
const profileRoute = require('../routes/profile-route')
const transactionRoute = require('../routes/transaction-route')
const { authenticateJWT } = require("../middleware/auth")

route.use('/auth', authRoute)
route.use('/profile', profileRoute)
route.use('/transaction', authenticateJWT, transactionRoute)

module.exports = route