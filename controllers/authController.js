const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { format } = require('date-fns')

const handleLogin = async (req, res) => {
    const { email, password } = req.body
    if (!email || !password)
        return res
            .status(400)
            .json({ message: 'Email and password are required.' })

    //found User by email
    const foundUser = await User.findOne({ email }).exec()
    if (!foundUser) return res.status(401).json({ message: 'Not found' })

    // evaluate password
    const match = await bcrypt.compare(password, foundUser.password)

    if (match) {
        //select roles form user
        const roles = Object.values(foundUser.roles).filter(Boolean)
        const newDate = await format(new Date(), 'yyyy-MM-dd\tHH:mm:ss')

        //create JWT token
        const accessToken = jwt.sign(
            {
                UserInfo: {
                    id: foundUser._id,
                    roles,
                },
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: '30s',
            }
        )

        //create refresh token
        const refreshToken = jwt.sign(
            { email }, //decoded refreshTokenController
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        // console.log(foundUser.date)

        // Saving refreshToken with current user
        foundUser.refreshToken = refreshToken
        foundUser.date = newDate
        await foundUser.save()

        // Creates Secure Cookie with refresh token
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        })

        // Send authorization roles and access token to user
        res.json({ accessToken })
    } else {
        res.status(401).json({
            message: 'Email or password error.',
        })
    }
}

module.exports = { handleLogin }
