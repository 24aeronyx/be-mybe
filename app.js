const express = require('express')
const app = express()
const allRoutes = require('./routes')
const cors = require('cors');
require('dotenv').config();

const PORT = process.env.PORT

app.use(express.json())
app.use(cors());
app.use(allRoutes)

app.listen(PORT, ()=>{
    console.log('listening on port ' + PORT)
})