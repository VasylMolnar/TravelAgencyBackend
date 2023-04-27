const Room = require('../model/Room')
const User = require('../model/User')
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

//select all booking by User
const handleBooking = async (req, res) => {
    if (!req?.params) return res.sendStatus(400)
    const userID = req.params.id

    //find current user
    const currentUser = await User.findById({
        _id: userID,
    }).exec()

    if (!currentUser) return res.status(401).json({ message: 'Not found' })

    //find booking Hotel
    const bookingHotel = currentUser.bookingHotel
    const currentBooking = []

    for (const hotelItem of bookingHotel) {
        const hotelId = hotelItem.hotelId

        const hotelRoomList = await Room.findOne({
            hotelId,
        }).exec()

        let prevRoomId = ''

        for (const roomItem of hotelItem.roomIds) {
            const roomId = roomItem.roomId
            const cardId = roomItem._id

            if (prevRoomId === roomId) {
                continue
            }

            const currentRoom = hotelRoomList.hotelRooms.find(
                (item) => item._id.toString() === roomId
            )

            const userParams = { hotelId: hotelId, roomId: roomId, cardId }

            if (currentRoom) {
                currentBooking.push(
                    ...currentRoom.bookingData
                        .filter(
                            (booking) => booking.userID.toString() === userID
                        )
                        .map((booking) => {
                            return {
                                booking,
                                ...userParams,
                            }
                        })
                )
            }
            prevRoomId = roomId
        }
    }

    // console.log(currentBooking)

    currentBooking
        ? res.status(200).send(currentBooking)
        : res.status(404).json({ message: 'List Empty' })
}

const handleCreateBooking = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    const value = req.body

    // console.log(value)

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

    //find current user
    const userID = req.body.userID

    //in find current user delete Booking by cardID
    const cardID = req.body.cardID

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find Room  by Hotel Id
    let roomList = await Room.findOne({ hotelId: parsedUrl[0] }).exec()

    //find User by User Id
    let currentUser = await User.findOne({ _id: userID }).exec()

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

        currentUser.bookingHotel.map((item) => {
            if (item.hotelId === parsedUrl[0]) {
                item.roomIds = item.roomIds.filter((booking) => {
                    console.log('booking', booking)
                    console.log('cardID', cardID)
                    return booking._id.toString() !== cardID
                })
            }

            return item
        })
    }

    console.log(currentUser.bookingHotel[0])
    try {
        await roomList.save()
        await currentUser.save()
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
