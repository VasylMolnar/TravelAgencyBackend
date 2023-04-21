const Room = require('../model/Room')

//admin and user

const handleAllRooms = (req, res) => {}

const handleRoom = (req, res) => {}

//admin

const handleCreateRoom = async (req, res) => {
    if (!req?.body) return res.sendStatus(400)
    const value = req.body.hotelRooms
    const hotelId = req.body.hotelId

    //find Room collections by Hotel Id
    let roomCollection = await Room.findOne({ hotelId: hotelId }).exec()

    if (roomCollection) {
        try {
            roomCollection.hotelRooms.push(value[0])
            await roomCollection.save()

            res.sendStatus(201)
        } catch (e) {
            res.status(500).json(e.message)
        }
    } else {
        try {
            await Room.create({ ...value })
            res.sendStatus(201)
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
}

const handleDeleteRoom = (req, res) => {}

const handleUpdateRoom = (req, res) => {}

module.exports = {
    handleAllRooms,
    handleRoom,
    handleCreateRoom,
    handleDeleteRoom,
    handleUpdateRoom,
}
