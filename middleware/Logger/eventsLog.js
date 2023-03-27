const { format } = require('date-fns')
const { v4: uuidv4 } = require('uuid')
const fsPromises = require('fs').promises
const fs = require('fs')
const path = require('path')

const eventsLog = async (message, logName) => {
    console.log(message)
    const data = `${format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')}`
    const logItem = `\n ${data} \t ${uuidv4()} \t ${message}`

    try {
        if (!fs.existsSync(path.join(__dirname, '..', logs))) {
            await fsPromises.mkdir(path.join(__dirname, '..', 'logs'))
        }

        await fsPromises.appendFile(
            (path.join(__dirname), '..', 'logs', logName),
            logItem
        )
    } catch (err) {
        console.log('Error: ', err)
    }
}

module.exports = eventsLog
