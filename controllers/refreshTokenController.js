const User = require('../model/User')
const jwt = require('jsonwebtoken')

const handleTokenRefresh = async (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    //check to DB
    const refreshToken = cookies.jwt

    const foundUser = await User.findOne({ refreshToken }).exec()
    if (!foundUser) return res.sendStatus(403) //Forbidden

    // verify validation REFRESH TOKEN jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            //user email === REFRESH_TOKEN decoded {email} authCont...
            if (err || foundUser.email !== decoded.email) {
                return res.sendStatus(403)
            }

            const roles = Object.values(foundUser.roles).filter(Boolean)

            //create JWT token
            const accessToken = jwt.sign(
                {
                    UserInfo: {
                        username: foundUser.username,
                        email: foundUser.email,
                        roles: roles,
                    },
                },
                process.env.ACCESS_TOKEN_SECRET,
                {
                    expiresIn: '1m',
                }
            )

            res.json({ roles, accessToken })
        }
    )
}

module.exports = { handleTokenRefresh }
