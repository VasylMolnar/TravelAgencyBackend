const mongoose = require('mongoose')
const Schema = mongoose.Schema

const roomSchema = new Schema({
    hotelId: {
        type: String,
        required: true,
    },

    hotelRooms: [
        {
            roomNumber: {
                type: Number,
                required: true,
            },

            roomFloor: {
                type: Number,
                required: true,
            },

            price: {
                type: Number,
                required: true,
            },

            capacity: {
                type: Number,
                required: true,
            },

            description: {
                type: String,
                required: true,
            },

            img: [
                {
                    name: { type: String },
                    data: { type: Buffer },
                    contentType: { type: String },
                },
            ],

            bookingData: [
                {
                    userID: { type: String },
                    dataEnd: { type: String },
                    dataOff: { type: String },
                    finalPrice: { type: Number },
                },
            ],
        },
    ],
})

module.exports = mongoose.model('Room', roomSchema)
