const mongoose = require('mongoose')
const Schema = mongoose.Schema

const gallerySchema = new Schema({
    userID: {
        type: String,
        required: true,
    },

    userName: {
        type: String,
        required: false,
    },

    img: [
        {
            title: { type: String },
            name: { type: String },
            data: { type: Buffer },
            contentType: { type: String },

            reactions: {
                thumbsUp: { type: Number, default: 0 },
                wow: { type: Number, default: 0 },
                heart: { type: Number, default: 0 },
                rocket: { type: Number, default: 0 },
                coffee: { type: Number, default: 0 },
            },
        },
    ],
})

module.exports = mongoose.model('Gallery', gallerySchema)
