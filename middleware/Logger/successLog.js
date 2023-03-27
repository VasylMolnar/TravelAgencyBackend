const eventsLog = require('./eventsLog')
const signale = require('signale')

const successLog = (req, res, next) => {
    eventsLog(`${req.method}\t${req.headers.origin}\t${req.url}`, 'reqLog.txt')
    signale.info(`${req.method} ${req.path}`)
    next()
}

module.exports = successLog
