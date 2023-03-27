const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd)
        return res
            .status(400)
            .json({ message: 'Username and password are required.' })

    //find user
    const foundUser = await User.findOne({ username: user }).exec()
    if (!foundUser) return res.status(401).json({ message: 'User not found.' })

    // evaluate password
    const match = await bcrypt.compare(foundUser.password, pwd)

    if (match) {
        //create token and refresh token

        // create JWTs
        const accessToken = await jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    roles: [],
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1m' }
        )

        //create REFRESH TOKEN
        const refreshToken = await jwt.sign(
            { username: foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
    } else {
        res.status(401).json({
            message: 'Username or password error.',
        })
    }
}

module.exports = { handleLogin }
