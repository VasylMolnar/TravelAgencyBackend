const User = require('../model/User')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: 'Username and password are required.' })

    // check for duplicate usernames in the db
}

module.exports = { handleNewUser }
