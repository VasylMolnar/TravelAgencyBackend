const router = require('express').Router()
const hotelController = require('../controllers/hotelController')
const multer = require('multer')
const upload = multer()

router
    .route('/')
    .get(hotelController.handleAllHotels)
    .post(upload.array('image'), hotelController.handleCreateHotel)

router
    .route('/:id')
    .get(hotelController.handleHotel)
    .put(upload.array('image'), hotelController.handleUpdateHotel)
    .delete(hotelController.handleDeleteHotel)

module.exports = router
