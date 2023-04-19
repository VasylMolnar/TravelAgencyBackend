const mongoose = require('mongoose')
const Schema = mongoose.Schema

const hotelSchema = new Schema({
    hotelName: {
        type: String,
        required: true,
    },

    country: {
        type: String,
        required: true,
    },

    city: {
        type: String,
        required: true,
    },

    address: {
        type: String,
        required: true,
    },

    // img: [
    //     {
    //         name: { type: String },
    //         data: { type: Buffer },
    //         contentType: { type: String },
    //     },
    // ],

    img: [
        {
            name: { type: String },
            data: { type: Buffer },
            contentType: { type: String },
        },
    ],

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
})

module.exports = mongoose.model('Hotel', hotelSchema)
