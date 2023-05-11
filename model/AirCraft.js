const mongoose = require('mongoose')
const Schema = mongoose.Schema

const airCraftSchema = new Schema({
    airLineId: {
        type: String,
        required: true,
    },

    airLinePlane: [
        {
            departure: {
                type: String,
                required: true,
            },

            arrival: {
                type: String,
                required: true,
            },

            price: {
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
                    departure: { type: String },
                    arrival: { type: String },
                    date: { type: String },
                    price: { type: Number },
                },
            ],
        },
    ],
})

module.exports = mongoose.model('AirCraft', airCraftSchema)
