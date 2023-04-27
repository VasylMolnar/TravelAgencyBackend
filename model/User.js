const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    roles: {
        User: {
            type: Number,
            default: 2001,
        },
        Editor: Number,
        Admin: Number,
    },
    password: {
        type: String,
        required: true,
    },
    date: {
        type: String,
        required: true,
    },
    avatar: {
        name: { type: String },
        data: { type: Buffer },
        contentType: { type: String },
    },
    galleryID: String,
    refreshToken: String,
    bookingHotel: [
        {
            hotelId: { type: String },

            roomIds: [
                {
                    roomId: { type: String },
                },
            ],
        },
    ],
})

module.exports = mongoose.model('User', userSchema)
