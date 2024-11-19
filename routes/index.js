const express = require("express")
const route = express.Router()
const authRoute = require('../routes/auth-route')
const profileRoute = require('../routes/profile-route')

route.use('/auth', authRoute)
route.use('/profile', profileRoute)

module.exports = route