const router = require('express').Router()
const roomController = require('../controllers/roomController')
const verifyJWT = require('../middleware/verifyJWT')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')
const multer = require('multer')
const upload = multer()

//by Hotel Id
router
    .route('/:id')
    .post(
        verifyJWT,
        verifyRoles(roles.Admin),
        upload.array('image'),
        roomController.handleCreateRoom
    )
    .get(roomController.handleAllRoomsByHotelId)

//by Hotel ID + Room ID
router
    .route('/:id/:id')
    .get(roomController.handleRoomByHotelId)
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

/*
data in Server

[//All list
    {
        "hotelId": "64422987787a716f64f149ee",
        "hotelRooms": [//rooms by hotel ID
            {
                "roomNumber": 5,
                "roomFloor":5 ,
                "price": 7500,
                "capacity":50,
                "description":"test 3 "
                "img":[{}]
            },
            {
                "roomNumber": 15,
                "roomFloor":1 ,
                "price": 700,
                "capacity":5,
                "description":"test 3 "
                "img":[{}]
            }
        ]
    },

    {
        "hotelId": "2",
        "hotelRooms": [
            {
                "roomNumber": 15,
                "roomFloor":3 ,
                "price": 300,
                "capacity":1,
                "description":"test 5 "
                "img":[{}]
            }
        ]
    }

]
*/
