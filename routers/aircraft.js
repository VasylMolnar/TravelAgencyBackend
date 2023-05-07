const router = require('express').Router()
const airCraftController = require('../controllers/airCraftController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')
const multer = require('multer')
const upload = multer()

//by AirLine Id
router
    .route('/:id')
    .post(
        verifyJWT,
        verifyRoles(roles.Admin),
        upload.array('image'),
        airCraftController.handleCreateAirCraft
    )
    .get(airCraftController.handleAllAirCraft)

//by AirLine ID + AirCraft ID
router
    .route('/:id/:id')
    .get(airCraftController.handleAirCraft)
    .put(
        verifyJWT,
        verifyRoles(roles.Admin),
        upload.array('image'),
        airCraftController.handleUpdateAirCraft
    )
    .delete(
        verifyJWT,
        verifyRoles(roles.Admin),
        airCraftController.handleDeleteAirCraft
    )

module.exports = router
