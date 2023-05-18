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
        CallCenter: Number,
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

    bookingAirLine: [
        {
            airLineId: { type: String },

            airCraftIds: [
                {
                    airCraftId: { type: String },
                },
            ],
        },
    ],
})

module.exports = mongoose.model('User', userSchema)
