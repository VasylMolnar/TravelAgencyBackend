require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const signale = require('signale')
const mongoose = require('mongoose')
const dbConnect = require('./config/dbConnect')
const successLog = require('./middleware/Logger/successLog')
const PORT = process.env.PORT

// connect to MongoDB
dbConnect()

// custom middleware logger
app.use(successLog) //in this we not have event we have function

//run server after connection to DB
mongoose.connection.once('open', () => {
    signale.pending('Connected to MongoDB')
    app.listen(PORT, () => signale.success(`Server running on port ${PORT}`))
})
