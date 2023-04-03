const router = require('express').Router()
const userController = require('../controllers/userController')
/*
1: update User
2: delete User

//for admin
3: create (register.js)
4: get All
5: get by UserID
*/

router.get('/', userController.handleAllUsers)

router
    .route('/:id')
    .get(userController.handleUserById)
    .delete(userController.handleDelete)
    .put(userController.handleUpdate)

module.exports = router
