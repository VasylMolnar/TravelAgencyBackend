const router = require('express').Router()
const userController = require('../controllers/userController')
/*
1: update User
2: delete User

//for admin
1: update User
2: delete User
3: create 
4: get All
5: get by UserID
*/

router
    .route('/:id')
    .delete(userController.handleDelete)
    .put(userController.handleUpdate)
module.exports = router
