/*
    Work:
        1: check to GET data from client (if client is not included in allowedOrigins we not GET data from this client)
        2: check SEND private User Auth data (headers, cookies ...) (if client is not included in allowedOrigins we not SEND data)

    credentials:
        1: select client origin includes allowedOrigins (verify name of site)
        2: if name site (origin) includes allowedOrigins return true
        3: if not origin blocked

 */
const allowedOrigins = require('../config/allowedOrigins')

const credentials = (req, res, next) => {
    // console.log('headers', req.headers)
    // console.log('body', req.body)

    const origin = req.headers.origin

    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true)
    }

    next()
}

module.exports = credentials
