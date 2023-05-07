const User = require('../model/User')
const AirCraft = require('../model/User')

//admin and user
const handleAllBookingByAirLine = async (req, res) => {
    if (!req?.params) return res.sendStatus(400)
    const id = req.params.id

    // find AirCraft  by AirLine Id
    let airLineList = await AirCraft.findOne({ airLineId: id }).exec()

    if (!airLineList) {
        res.status(404).json({ message: 'airLineList list not found' })
    } else {
        //res all Booking in this AirLine
        const allBookings = airLineList.airLinePlane.map(
            (airCraft) => airCraft.bookingData
        )

        allBookings
            ? res.status(200).send(allBookings)
            : res.status(404).json({ message: 'airLineList not found' })
    }
}

const handleAllBookingByAirCraft = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find AirCraft  by AirLine Id
    let airLineList = await AirCraft.findOne({
        airLineId: parsedUrl[0],
    }).exec()

    if (!airLineList) {
        res.status(404).json({ message: 'airLineList list not found' })
    } else {
        //find Current airCraft  by airCraft Id
        const currentAirCruft = airLineList.airLinePlane.find(
            (item) => item._id.toString() === parsedUrl[1]
        )

        currentAirCruft
            ? res.status(200).send(currentAirCruft.bookingData)
            : res.status(404).json({ message: 'airLineList not found' })
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

    //find booking AirLine
    const bookingAirLine = currentUser.bookingAirLine
    const currentBooking = []

    for (const airLineItem of bookingAirLine) {
        const airLineId = airLineItem.airLineId

        //select AirCraft by AirLine Id
        const airLineList = await AirCraft.findOne({
            airLineId,
        }).exec()

        let prevRoomId = ''

        for (const airCraftItem of airLineItem.airCraftIds) {
            const airCraftId = airCraftItem.airCraftId
            const cardId = airCraftItem._id

            if (prevRoomId === airCraftId) {
                continue
            }

            const currentAirCraft = airLineList.airLinePlane.find(
                (item) => item._id.toString() === airCraftId
            )

            const userParams = {
                airLineId: airLineId,
                airCraftId: airCraftId,
                cardId,
            }

            if (currentAirCraft) {
                currentBooking.push(
                    ...currentAirCraft.bookingData
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

    //find AirCraft  by AirLine Id
    let airLineList = await AirCraft.findOne({ airLineId: parsedUrl[0] }).exec()

    if (!airLineList) {
        res.status(404).json({ message: 'AirLine list not found' })
    } else {
        //find Current AirCraft  by AirCraft Id and add Booking

        airLineList.airLinePlane = airLineList.airLinePlane.map((item) => {
            if (item._id.toString() === parsedUrl[1]) {
                item.bookingData.push(value)

                return item
            } else {
                return item
            }
        })

        try {
            await airLineList.save()
            res.status(200).json({ message: 'Booking successfully' })
        } catch (e) {
            res.status(404).json({ message: 'Booking not successfully' })
        }
    }
}

const handleUpdateBooking = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)

    //new update values
    const newValue = req.body.newValue

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find AirCraft  by AirLine Id
    let airLineList = await AirCraft.findOne({ airLineId: parsedUrl[0] }).exec()

    if (!airLineList) {
        res.status(404).json({ message: 'AirCruft list not found' })
    } else {
        //find Current AirCruft  by AirCruft Id and delete Booking by id

        airLineList.airLinePlane = airLineList.airLinePlane.map((item) => {
            if (item._id.toString() === parsedUrl[1]) {
                return {
                    ...item,
                    bookingData: item.bookingData.map((booking) => {
                        return booking._id.toString() === parsedUrl[2]
                            ? { ...booking, ...newValue }
                            : booking
                    }),
                }
            }
            return item
        })
    }

    // console.log(roomList.hotelRooms[0])
    try {
        await airLineList.save()
        res.status(200).json({ message: 'Booking Update successfully' })
    } catch (e) {
        res.status(404).json({ message: 'Booking cannot be Update' })
    }
}

const handleDeleteBooking = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)

    //find current user
    const userID = req?.body?.userID

    //in find current user delete Booking by cardID
    const bookingIdUser = req?.body?.bookingIdUser

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find AirCraft  by AirLine Id
    let airLineList = await AirCraft.findOne({
        airCraftId: parsedUrl[0],
    }).exec()

    //find User by User Id
    let currentUser = await User.findOne({ _id: userID }).exec()

    if (!airLineList) {
        res.status(404).json({ message: 'AirLine list not found' })
    } else {
        //find Current Room  by Room Id and delete Booking by id

        airLineList.airLinePlane = airLineList.airLinePlane.map((item) => {
            if (item._id.toString() === parsedUrl[1]) {
                return {
                    ...item,
                    bookingData: item.bookingData.filter(
                        (booking) => booking._id.toString() !== parsedUrl[2]
                    ),
                }
            } else {
                return item
            }
        })

        if (userID) {
            currentUser.bookingAirLine.map((item) => {
                if (item.airLine === parsedUrl[0]) {
                    item.airCraftIds = item.airCraftIds.filter((booking) => {
                        return booking._id.toString() !== bookingIdUser
                    })
                }

                return item
            })
        }
    }

    // console.log(currentUser.bookingHotel[0])
    try {
        await airLineList.save()
        if (userID) {
            await currentUser.save()
        }
        res.status(200).json({ message: 'Booking Delete successfully' })
    } catch (e) {
        res.status(501).json({ message: 'Booking cannot be Delete' })
    }
}

module.exports = {
    handleBooking,
    handleAllBookingByAirCraft,
    handleAllBookingByAirLine,
    handleCreateBooking,
    handleUpdateBooking,
    handleDeleteBooking,
}
