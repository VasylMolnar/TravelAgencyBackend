const role = require('../config/roles_list')

const verifyRoles = (...allowedRoles) => {
    return (req, res, next) => {
        console.log(req.heder)

        res.send(200)
    }
}

module.exports = verifyRoles
