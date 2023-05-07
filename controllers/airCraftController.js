const AirCraft = require('../model/AirCraft')

//admin and user
//by AirLIne Id
const handleAllAirCraft = async (req, res) => {
    if (!req.params) return res.sendStatus(400)
    const { id: hotelId } = req.params

    //find All Room collections by Hotel
    const currentRooms =
        (await AirCraft.findOne({ hotelId: hotelId }).exec()) || []

    if (!currentRooms) {
        res.status(500).json({ message: 'List is empty' })
    } else {
        const rooms =
            currentRooms?.hotelRooms?.map((item) => {
                return {
                    id: item._id,
                    roomNumber: item.roomNumber,
                    roomFloor: item.roomFloor,
                    price: item.price,
                    capacity: item.capacity,
                    img: item.img,
                    description: item.description,
                }
            }) || []

        res.status(200).send(rooms)
    }
}

const handleAirCraft = async (req, res) => {
    if (!req._parsedUrl.path) return res.sendStatus(400)
    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find Room list by Hotel Id
    const roomList = await AirCraft.findOne({ hotelId: parsedUrl[0] }).exec()

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
//by AirLine Id
const handleCreateAirCraft = async (req, res) => {
    if (!req?.body || !req.params) return res.sendStatus(400)
    const value = JSON.parse(req.body.values)
    const { id: hotelId } = req.params

    const imageInfo = req.files

    const images = imageInfo.map((item) => ({
        name: item.originalname,
        data: item.buffer,
        contentType: item.mimetype,
    }))
    value.hotelRooms[0].img = images

    //find Room collections by Hotel Id
    let roomCollection = await AirCraft.findOne({ hotelId: hotelId }).exec()

    if (roomCollection) {
        try {
            roomCollection.hotelRooms.push(value.hotelRooms[0])
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

const handleDeleteAirCraft = async (req, res) => {
    if (!req._parsedUrl.path) return res.sendStatus(400)
    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find Room list by Hotel Id
    let roomList = await AirCraft.findOne({ hotelId: parsedUrl[0] }).exec()

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

const handleUpdateAirCraft = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)
    const imageInfo = req.files
    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    const newValue = JSON.parse(req.body.values)

    const images = imageInfo.map((item) => ({
        name: item.originalname,
        data: item.buffer,
        contentType: item.mimetype,
    }))

    //find Room list by Hotel Id
    let roomList = await AirCraft.findOne({ hotelId: parsedUrl[0] }).exec()

    if (!roomList) {
        res.status(404).json({ message: 'Rooms list not found' })
    } else {
        //find Current Room  by Room Id and update

        roomList.hotelRooms = roomList.hotelRooms.map((room) => {
            return room._id.toString() === parsedUrl[1]
                ? { ...room, ...newValue, img: images }
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
    handleAirCraft,
    handleCreateAirCraft,
    handleDeleteAirCraft,
    handleUpdateAirCraft,
    handleAllAirCraft,
}
