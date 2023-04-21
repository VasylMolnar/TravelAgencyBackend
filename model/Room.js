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
                type: String,
                required: true,
            },

            roomFloor: {
                type: String,
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

            img: [
                {
                    name: { type: String },
                    data: { type: Buffer },
                    contentType: { type: String },
                },
            ],

            description: {
                type: String,
                required: true,
            },
        },
    ],
})

module.exports = mongoose.model('Room', roomSchema)
//booking room
