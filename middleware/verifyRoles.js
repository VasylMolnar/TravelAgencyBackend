const signale = require('signale')

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const roles = req.headers.roles.split(',')
        // console.log('', req.headers.roles)
        // console.log('', roles)

        signale.info('VerifyRoles: ', roles)

        if (!req?.headers?.roles) return res.sendStatus(401)

        //find roles
        const rolesArray = [...allowedRoles]

        const result = roles
            .map((role) => {
                return rolesArray.includes(Number(role))
            })
            .find((val) => val === true)

        if (!result) return res.sendStatus(401)

        next()
    }
}

module.exports = verifyRoles
