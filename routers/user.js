const router = require('express').Router()
const userController = require('../controllers/userController')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')
const multer = require('multer')
const upload = multer()

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
    .route('/:id/booking')
    .put(verifyRoles(roles.User), userController.handleBooking)

router
    .route('/:id')
    .get(verifyRoles(roles.Admin, roles.User), userController.handleUserById)
    .delete(verifyRoles(roles.Admin, roles.User), userController.handleDelete)
    .put(verifyRoles(roles.User), userController.handleUpdate)

router.post(
    '/:id/uploads',
    verifyRoles(roles.User),
    upload.single('image'),
    userController.handleUploadImg
)

module.exports = router
