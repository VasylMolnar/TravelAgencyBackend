const Room = require('../model/Room')
// hotelRoomList == roomList

//admin and user
const handleAllBookingByHotel = async (req, res) => {
    if (!req?.params) return res.sendStatus(400)
    const id = req.params.id

    // find Room  by Hotel Id
    let roomList = await Room.findOne({ hotelId: id }).exec()

    if (!roomList) {
        res.status(404).json({ message: 'Rooms list not found' })
    } else {
        //res all Booking in this Hotel
        const allBookings = roomList.hotelRooms.map((room) => room.bookingData)

        allBookings
            ? res.status(200).send(allBookings)
            : res.status(404).json({ message: 'Hotel not found' })
    }
}

const handleAllBookingByRoom = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find Room  by Hotel Id
    let roomList = await Room.findOne({ hotelId: parsedUrl[0] }).exec()

    if (!roomList) {
        res.status(404).json({ message: 'Rooms list not found' })
    } else {
        //find Current Room  by Room Id
        const currentRoom = roomList.hotelRooms.find(
            (room) => room._id.toString() === parsedUrl[1]
        )

        currentRoom
            ? res.status(200).send(currentRoom.bookingData)
            : res.status(404).json({ message: 'Room not found' })
    }
}

const handleBooking = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find Room  by Hotel Id
    let hotelRoomList = await Room.findOne({ hotelId: parsedUrl[0] }).exec()

    if (!hotelRoomList) {
        res.status(404).json({ message: 'Rooms list not found' })
    } else {
        //find Current Booking  by Room Id
        const currentBooking = []

        for (const room of hotelRoomList.hotelRooms) {
            if (room._id.toString() === parsedUrl[1]) {
                currentBooking.push(
                    room.bookingData.find(
                        (booking) => booking._id.toString() === parsedUrl[2]
                    )
                )
            }
        }

        currentBooking
            ? res.status(200).send(currentBooking)
            : res.status(404).json({ message: 'Room not found' })
    }
}

const handleCreateBooking = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    const value = req.body

    console.log(value)

    //find Room  by Hotel Id
    let roomList = await Room.findOne({ hotelId: parsedUrl[0] }).exec()

    if (!roomList) {
        res.status(404).json({ message: 'Rooms list not found' })
    } else {
        //find Current Room  by Room Id and add Booking

        roomList.hotelRooms = roomList.hotelRooms.map((room) => {
            if (room._id.toString() === parsedUrl[1]) {
                room.bookingData.push(value)

                return room
            } else {
                return room
            }
        })

        try {
            await roomList.save()
            res.status(200).json({ message: 'Booking successfully' })
        } catch (e) {
            res.status(404).json({ message: 'Booking not successfully' })
        }
    }
}

const handleUpdateBooking = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    const value = req.body

    //find Room  by Hotel Id
    let roomList = await Room.findOne({ hotelId: parsedUrl[0] }).exec()

    if (!roomList) {
        res.status(404).json({ message: 'Rooms list not found' })
    } else {
        //find Current Room  by Room Id and update Booking by id

        roomList.hotelRooms = roomList.hotelRooms.map((room) => {
            if (room._id.toString() === parsedUrl[1]) {
                return {
                    ...room,
                    bookingData: room.bookingData.map((booking) => {
                        if (booking._id.toString() === parsedUrl[2]) {
                            return {
                                ...booking,
                                ...value,
                            }
                        } else {
                            return booking
                        }
                    }),
                }
            } else {
                return room
            }
        })

        try {
            await roomList.save()
            res.status(200).json({ message: 'Booking successfully' })
        } catch (e) {
            res.status(404).json({ message: 'Booking not successfully' })
        }
    }
}

const handleDeleteBooking = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find Room  by Hotel Id
    let roomList = await Room.findOne({ hotelId: parsedUrl[0] }).exec()

    if (!roomList) {
        res.status(404).json({ message: 'Rooms list not found' })
    } else {
        //find Current Room  by Room Id and delete Booking by id

        roomList.hotelRooms = roomList.hotelRooms.map((room) => {
            if (room._id.toString() === parsedUrl[1]) {
                return {
                    ...room,
                    bookingData: room.bookingData.filter(
                        (booking) => booking._id.toString() !== parsedUrl[2]
                    ),
                }
            } else {
                return room
            }
        })
    }

    try {
        await roomList.save()
        res.status(200).json({ message: 'Booking Delete successfully' })
    } catch (e) {
        res.status(404).json({ message: 'Booking cannot be Delete' })
    }
}

module.exports = {
    handleBooking,
    handleAllBookingByRoom,
    handleAllBookingByHotel,
    handleCreateBooking,
    handleUpdateBooking,
    handleDeleteBooking,
}
