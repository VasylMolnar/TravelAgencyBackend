const User = require('../model/User')
const AirCraft = require('../model/AirCraft')

//select all booking by User see in bookingController

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

    console.log(parsedUrl)

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

const handleCreateBooking = async (req, res) => {
    if (!req?._parsedUrl.path || !req?.body) return res.sendStatus(400)

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    const value = req.body

    console.log(value)

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
        res.status(404).json({ message: 'AirCraft list not found' })
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
        airLineId: parsedUrl[0],
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
                if (item.airLineId === parsedUrl[0]) {
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
    handleAllBookingByAirCraft,
    handleAllBookingByAirLine,
    handleCreateBooking,
    handleUpdateBooking,
    handleDeleteBooking,
}
