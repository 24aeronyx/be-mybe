const express = require('express')
const app = express()
const allRoutes = require('./routes')

const PORT = process.env.PORT || 3001

app.use(express.json())
app.use(allRoutes)

app.listen(PORT, ()=>{
    console.log('listening on port ' + PORT)
})