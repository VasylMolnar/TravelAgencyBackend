const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: 'Username and password are required.' })
}

module.exports = { handleLogin }
