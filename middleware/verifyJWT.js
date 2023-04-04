//verify user Auth by (JWT Access Token)
const jwt = require('jsonwebtoken')
require('dotenv').config()

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    if (!authHeader?.startsWith('Bearer ')) return res.sendStatus(401)

    //select token
    const token = authHeader.split(' ')[1]

    //verify Token
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.status(403).json({ message: err.message }) //invalid token

        //add to req new item roles and sent to next fun (in verifyRoles)
        req.roles = decoded.UserInfo.roles //or send roles json from client

        //if token is valid
        next()
    })
}

module.exports = verifyJWT
