const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { email, pwd } = req.body
    if (!email || !pwd)
        return res
            .status(400)
            .json({ message: 'Email and password are required.' })

    //found User by email
    const foundUser = await User.findOne({ email }).exec()
    console.log(foundUser)
    if (!foundUser) return res.status(401).json({ message: 'Not found' })

    // evaluate password
    const match = await bcrypt.compare(pwd, foundUser.password)

    if (match) {
        //select roles form user
        const roles = Object.values(foundUser.roles).filter(Boolean)

        //create JWT token
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    username: foundUser.username,
                    email,
                    roles: roles,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '1m',
            }
        )

        //create refresh token
        const refreshToken = jwt.sign(
            { email }, //decoded refreshTokenController
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken
        await foundUser.save()

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        })

        // Send authorization roles and access token to user
        res.json({ user: foundUser.username, email, roles, accessToken })
    } else {
        res.status(401).json({
            message: 'Email or password error.',
        })
    }
}

module.exports = { handleLogin }
