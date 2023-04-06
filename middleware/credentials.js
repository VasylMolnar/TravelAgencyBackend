/*
    verify send private User Auth data

    1: select client origin includes allowedOrigins (verify name of site)
    2: if name site (origin) includes allowedOrigins return true
    3: if not origin blocked

 */
const allowedOrigins = require('../config/allowedOrigins')

const credentials = (req, res, next) => {
    // console.log('headers', req.headers)
    const origin = req.headers.origin

    if (allowedOrigins.includes(origin)) {
        res.header('Access-Control-Allow-Credentials', true)
    }

    next()
}

module.exports = credentials
