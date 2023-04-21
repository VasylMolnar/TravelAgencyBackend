const router = require('express').Router()
const hotelController = require('../controllers/hotelController')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')
const multer = require('multer')
const upload = multer()
const verifyJWT = require('../middleware/verifyJWT')

router
    .route('/')
    .get(hotelController.handleAllHotels)
    .post(
        verifyJWT,
        verifyRoles(roles.Admin),
        upload.array('image'),
        hotelController.handleCreateHotel
    )

router
    .route('/:id')
    .get(hotelController.handleHotel)
    .put(
        verifyJWT,
        verifyRoles(roles.Admin),
        upload.array('image'),
        hotelController.handleUpdateHotel
    )
    .delete(
        verifyJWT,
        verifyRoles(roles.Admin),
        hotelController.handleDeleteHotel
    )

module.exports = router
