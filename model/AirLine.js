const mongoose = require('mongoose')
const Schema = mongoose.Schema

const airLineSchema = new Schema({
    nameAirLine: {
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
})

module.exports = mongoose.model('AirLine', airLineSchema)
