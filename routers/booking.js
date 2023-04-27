const router = require('express').Router()
const bookingController = require('../controllers/bookingController')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')

//Hotel Id
// router.get(
//     '/:id',
//     verifyRoles(roles.Admin),
//     bookingController.handleAllBookingByHotel
// )

// User Id
router.get('/:id', bookingController.handleBooking)

//Hotel Id + Room Id
router
    .route('/:id/:id')
    .get(
        verifyRoles(roles.Admin, roles.User),
        bookingController.handleAllBookingByRoom
    )
    .post(
        verifyRoles(roles.Admin, roles.User),
        bookingController.handleCreateBooking
    )

//Hotel Id + Room Id + Booking Id
router
    .route('/:id/:id/:id')
    // .get(verifyRoles(roles.Admin, roles.User), bookingController.handleBooking)
    .put(
        verifyRoles(roles.Admin, roles.User),
        bookingController.handleUpdateBooking
    )
    .delete(
        verifyRoles(roles.Admin, roles.User),
        bookingController.handleDeleteBooking
    )

module.exports = router
