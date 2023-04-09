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

    img: {
        type: Array,
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

    rooms: {
        type: Array,
        required: true,
    },
})
