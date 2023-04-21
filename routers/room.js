const router = require('express').Router()
const roomController = require('../controllers/roomController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')
const multer = require('multer')
const upload = multer()

router.route('/').get(roomController.handleAllRooms).post(
    // verifyJWT,
    // verifyRoles(roles.Admin),
    // upload.array('image'),
    roomController.handleCreateRoom
)

router
    .route('/:id')
    .get(roomController.handleRoom)
    .put(
        // verifyJWT,
        // verifyRoles(roles.Admin),
        // upload.array('image'),
        roomController.handleUpdateRoom
    )
    .delete(
        // verifyJWT,
        // verifyRoles(roles.Admin),
        roomController.handleDeleteRoom
    )

module.exports = router
