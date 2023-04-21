const Room = require('../model/Room')

//admin and user

const handleAllRooms = async (req, res) => {
    if (!req.params) return res.sendStatus(400)
    const { id: hotelId } = req.params

    //find All Room collections by Hotel
    const currentRooms = await Room.findOne({ hotelId: hotelId }).exec()
    if (!currentRooms) {
        return res.send([]) //list empty
    }

    try {
        const rooms = currentRooms.hotelRooms.map((item) => {
            return {
                id: item._id,
                roomNumber: item.name,
                roomFloor: item.country,
                price: item.city,
                capacity: item.address,
                img: item.img,
                description: item.description,
            }
        })
        res.status(200).send(rooms)
    } catch (e) {
        res.status(500).json({ message: e })
    }
}

const handleRoom = async (req, res) => {
    if (!req._parsedUrl.path) return res.sendStatus(400)
    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find Room list by Hotel Id
    const roomList = await Room.findOne({ hotelId: parsedUrl[0] }).exec()

    if (!roomList) {
        res.status(404).json({ message: 'Rooms list not found' })
    } else {
        //find Current Room  by Room Id
        const currentRoom = roomList.hotelRooms.find(
            (room) => room._id.toString() === parsedUrl[1]
        )

        currentRoom
            ? res.status(200).send(currentRoom)
            : res.status(404).json({ message: 'Room not found' })
    }
}

//admin

const handleCreateRoom = async (req, res) => {
    if (!req?.body || !req.params) return res.sendStatus(400)
    const value = req.body.hotelRooms
    const { id: hotelId } = req.params

    const imageInfo = req.files

    const images = imageInfo.map((item) => ({
        name: item.originalname,
        data: item.buffer,
        contentType: item.mimetype,
    }))

    //find Room collections by Hotel Id
    let roomCollection = await Room.findOne({ hotelId: hotelId }).exec()

    if (roomCollection) {
        try {
            roomCollection.hotelRooms.push(value[0])
            roomCollection.img = images
            await roomCollection.save()

            res.sendStatus(201)
        } catch (e) {
            res.status(500).json(e.message)
        }
    } else {
        try {
            await Room.create({ ...value, img: images })
            res.sendStatus(201)
        } catch (e) {
            res.status(500).json(e.message)
        }
    }
}

const handleDeleteRoom = async (req, res) => {
    if (!req._parsedUrl.path) return res.sendStatus(400)
    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find Room list by Hotel Id
    let roomList = await Room.findOne({ hotelId: parsedUrl[0] }).exec()

    if (!roomList) {
        res.status(404).json({ message: 'Rooms list not found' })
    } else {
        //find Current Room  by Room Id and delete
        roomList.hotelRooms = roomList.hotelRooms.filter(
            (room) => room._id.toString() !== parsedUrl[1]
        )

        try {
            await roomList.save()
            res.status(200).json({ message: 'Room deleted successfully' })
        } catch (e) {
            res.status(404).json({ message: 'Room cant be deleted ' })
        }
    }
}

const handleUpdateRoom = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)
    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    const newValue = req.body

    console.log(newValue)

    //find Room list by Hotel Id
    let roomList = await Room.findOne({ hotelId: parsedUrl[0] }).exec()

    if (!roomList) {
        res.status(404).json({ message: 'Rooms list not found' })
    } else {
        //find Current Room  by Room Id and update

        roomList.hotelRooms = roomList.hotelRooms.map((room) => {
            return room._id.toString() === parsedUrl[1]
                ? { ...room, ...newValue }
                : room
        })

        try {
            await roomList.save()
            res.status(200).json({ message: 'Room update successfully' })
        } catch (e) {
            res.status(404).json({ message: 'Room cant be update ' })
        }
    }
}

module.exports = {
    handleAllRooms,
    handleRoom,
    handleCreateRoom,
    handleDeleteRoom,
    handleUpdateRoom,
}

//booking room and multer
