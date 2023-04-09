const router = require('express').Router()
const hotelController = require('../controllers/hotelController')

router
    .route('/')
    .get(hotelController.handleAllHotels)
    .post(hotelController.handleCreateHotel)

router
    .route('/:id')
    .get(hotelController.handleHotel)
    .put(hotelController.handleUpdateHotel)
    .delete(hotelController.handleDeleteHotel)

module.exports = router
