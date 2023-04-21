const router = require('express').Router()
const roomController = require('../controllers/roomController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')
const multer = require('multer')
const upload = multer()

router
    .route('/:id')
    .post(
        verifyJWT,
        verifyRoles(roles.Admin),
        upload.array('image'),
        roomController.handleCreateRoom
    )
    .get(roomController.handleAllRooms)

router
    .route('/:id/:id')
    .get(roomController.handleRoom)
    .put(
        verifyJWT,
        verifyRoles(roles.Admin),
        upload.array('image'),
        roomController.handleUpdateRoom
    )
    .delete(
        verifyJWT,
        verifyRoles(roles.Admin),
        roomController.handleDeleteRoom
    )

module.exports = router

//booking room and multer
