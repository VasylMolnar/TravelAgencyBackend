const signale = require('signale')

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        const roles = req.roles
        signale.info('VerifyRoles: ', roles)

        console.log('', roles)
        if (!req?.roles) return res.sendStatus(401)

        //find roles
        const rolesArray = [...allowedRoles]
        const result = roles
            .map((role) => rolesArray.includes(role))
            .find((val) => val === true)

        if (!result) return res.sendStatus(401)

        next()
    }
}

module.exports = verifyRoles
