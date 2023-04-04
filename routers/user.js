const router = require('express').Router()
const userController = require('../controllers/userController')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')
/*
1: update User
2: delete User

//for admin
3: create (register.js)
4: get All
5: get by UserID
*/

router.get('/', verifyRoles(roles.Admin), userController.handleAllUsers)

router
    .route('/:id')
    .get(verifyRoles(roles.Admin), userController.handleUserById)
    .delete(verifyRoles(roles.Admin, roles.User), userController.handleDelete)
    .put(verifyRoles(roles.Admin, roles.User), userController.handleUpdate)
// .put(userController.handleUpdate)

module.exports = router
