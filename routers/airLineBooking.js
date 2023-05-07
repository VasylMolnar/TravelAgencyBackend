const router = require('express').Router()
const airLineBookingController = require('../controllers/airLineBookingController')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')

// User Id
router.get('/:id', airLineBookingController.handleBooking)

//Hotel Id + Room Id
router
    .route('/:id/:id')
    .get(
        verifyRoles(roles.Admin, roles.User),
        airLineBookingController.handleAllBookingByAirCraft
    )
    .post(
        verifyRoles(roles.Admin, roles.User),
        airLineBookingController.handleCreateBooking
    )

//Hotel Id + Room Id + Booking Id
router
    .route('/:id/:id/:id')
    .put(
        verifyRoles(roles.Admin, roles.User),
        airLineBookingController.handleUpdateBooking
    )
    .delete(
        verifyRoles(roles.Admin, roles.User),
        airLineBookingController.handleDeleteBooking
    )

module.exports = router
