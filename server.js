require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cookieParser = require('cookie-parser')
const cors = require('cors')
const signale = require('signale')
const mongoose = require('mongoose')
const dbConnect = require('./config/dbConnect')
const successLog = require('./middleware/Logger/successLog')
const errorLog = require('./middleware/Logger/errorLog')
const corsOptions = require('./config/corsOptions')
const credentials = require('./middleware/credentials')
const verifyJWT = require('./middleware/verifyJWT')

const PORT = process.env.PORT

// connect to MongoDB
dbConnect()

/**************** custom middleware ****************/
app.use(successLog) //in this we not have event we have function

// built-in middleware to handle urlencoded data
// in other words, form data:
// ‘content-type: application/x-www-form-urlencoded’
app.use(express.urlencoded({ extended: false }))

// built-in middleware for json
app.use(express.json())

//serve static files
app.use(express.static(path.join(__dirname, 'uploads')))

//cookies parser
app.use(cookieParser())

// Handle options credentials check - before CORS!
// and fetch cookies credentials requirement
app.use(credentials)

// Cross Origin Resource Sharing (Web security)
app.use(cors(corsOptions))

/****************** create routes  ***********************/
//public routes
app.use('/register', require('./routers/register'))
app.use('/auth', require('./routers/auth'))
app.use('/logout', require('./routers/logout'))
app.use('/refresh', require('./routers/refresh'))

//private and public routes
app.use('/hotel', require('./routers/hotel'))
app.use('/room', require('./routers/room'))
app.use('/gallery', require('./routers/gallery'))
app.use('/airline', require('./routers/airline'))
app.use('/aircraft', require('./routers/aircraft'))
app.use('/callCenter', require('./routers/callCenter'))

//private routes
//verify User Auth by (JWT Access Token)
app.use(verifyJWT)
app.use('/user', require('./routers/user'))
//Hotel
app.use('/booking', require('./routers/booking'))

//Plane
app.use('/planeBooking', require('./routers/airLineBooking'))

//error route
app.all('*', (req, res) => {
    res.status(404).json({ error: '404 Not Found' })
})

//catch error Log
app.use(errorLog)

//run server after connection to DB
mongoose.connection.once('open', () => {
    signale.pending('Connected to MongoDB')
    app.listen(PORT, () => signale.success(`Server running on port ${PORT}`))
})
