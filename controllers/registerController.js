const User = require('../model/User')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) => {
    const { email, user, pwd } = req.body
    if (!email || !user || !pwd)
        return res
            .status(400)
            .json({ message: 'Username and password are required.' })

    // check for duplicate usernames in the db
    const duplicate = await User.findOne({ email }).exec()
    if (duplicate) return res.status(409).json({ message: 'Duplicate email' }) //Conflict

    try {
        const hashedPwd = await bcrypt.hash(pwd, 10)

        await User.create({
            email,
            username: user,
            password: hashedPwd,
        })

        res.status(201).json({ success: `New user ${user} created!` })
    } catch (e) {
        res.status(500).json({ message: e.message })
    }
}

module.exports = { handleNewUser }
