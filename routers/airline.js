const router = require('express').Router()
const airLineController = require('../controllers/airLineController')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')
const multer = require('multer')
const upload = multer()
const verifyJWT = require('../middleware/verifyJWT')

router
    .route('/')
    .get(airLineController.handleAllAirLines)
    .post(
        verifyJWT,
        verifyRoles(roles.Admin),
        upload.array('image'),
        airLineController.handleCreateAirLine
    )

router
    .route('/:id')
    .get(airLineController.handleAirLine)
    .put(
        verifyJWT,
        verifyRoles(roles.Admin),
        upload.array('image'),
        airLineController.handleUpdateAirLine
    )
    .delete(
        verifyJWT,
        verifyRoles(roles.Admin),
        airLineController.handleDeleteAirLine
    )

module.exports = router
