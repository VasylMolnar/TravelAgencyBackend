const eventsLog = require('./eventsLog')
const signale = require('signale')

const successLog = (err, req, res, next) => {
    eventsLog(`${err.name}: ${err.message}`, 'errLog.txt')
    signale.error(`${req.method} ${req.path}`)
    res.status(500).send(err.message)
}

module.exports = successLog
