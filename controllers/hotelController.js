const Hotel = require('../model/Hotel')

const handleAllHotels = async (req, res) => {
    //return all list Hotels

    const listOfHotels = await Hotel.find().exec()

    !listOfHotels
        ? res.status(500).json({ message: 'List is empty' })
        : res.status(200).json(listOfHotels)
}

const handleHotel = async (req, res) => {
    const hotelID = req.params.id

    //find and return Hotel

    const currentHotel = await Hotel.findById({ _id: hotelID }).exec()

    currentHotel
        ? res.status(200).json(currentHotel)
        : res.status(501).json({ message: 'Hotel not found' })
}

const handleCreateHotel = async (req, res) => {
    if (!req?.body) return res.sendStatus(400)

    try {
        await Hotel.create({ ...req.body })
        res.sendStatus(201)
    } catch (e) {
        res.status(500).json(e.message)
    }
}

const handleDeleteHotel = async (req, res) => {
    const hotelID = req.params.id

    //find and delete user in DB by userID
    const currentHotel = await Hotel.findByIdAndDelete({ _id: hotelID })

    if (!currentHotel) {
        res.status(501).json({ message: 'Hotel cant be deleted' })
    } else {
        res.status(200).json({ message: 'Hotel deleted successfully' })
    }
}

const handleUpdateHotel = async (req, res) => {
    const hotelID = req.params.id

    //find and update Hotel by ID
    const currentHotel = await Hotel.findByIdAndUpdate(
        { _id: hotelID },
        req.body
    )

    if (currentHotel) {
        res.status(200).json({ message: 'Hotel update successfully' })
    } else {
        res.status(200).json({ message: 'Hotel cant be update' })
    }
}

module.exports = {
    handleAllHotels,
    handleHotel,
    handleCreateHotel,
    handleDeleteHotel,
    handleUpdateHotel,
}
