const mongoose = require('mongoose')
const Schema = mongoose.Schema

const callCenterSchema = new Schema({
    name: String,
    phone: String,
    email: String,
    text: String,
})

module.exports = mongoose.model('CallCenter', callCenterSchema)
