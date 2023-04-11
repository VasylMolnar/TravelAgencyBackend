const User = require('../model/User')
const bcrypt = require('bcrypt')
const { format } = require('date-fns')

const handleNewUser = async (req, res) => {
    const { email, username, password } = req.body
    if (!email || !username || !password)
        return res
            .status(400)
            .json({ message: 'Email, Username and Password are required.' })

    // check for duplicate email in the db
    const duplicate = await User.findOne({ email }).exec()
    if (duplicate)
        return res.status(409).json({ message: 'Email is already in use' }) //Conflict

    try {
        const hashedPwd = await bcrypt.hash(password, 10)
        const newData = await format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')

        await User.create({
            email,
            username,
            password: hashedPwd,
            date: newData,
        })

        res.status(201).json({ success: `New user ${username} created!` })
    } catch (e) {
        res.status(500).json(e.message)
    }
}

module.exports = { handleNewUser }
