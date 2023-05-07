const AirLine = require('../model/AirLine')

//admin and user
const handleAllAirLines = async (req, res) => {
    //return all list AirLine

    const listOfAirLines = (await AirLine.find().exec()).map((item) => {
        return {
            id: item._id,
            nameAirLine: item.nameAirLine,
            country: item.country,
            city: item.city,
            address: item.address,
            img: item.img,
            description: item.description,
        }
    })

    !listOfAirLines
        ? res.status(500).json({ message: 'List is empty' })
        : res.status(200).json(listOfAirLines)
}

const handleAirLine = async (req, res) => {
    const airLineID = req.params.id
    //find and return Hotel

    const currentAirLine = await AirLine.findById({ _id: airLineID }).exec()

    currentAirLine
        ? res.status(200).json(currentAirLine)
        : res.status(501).json({ message: 'AirLine not found' })
}

//admin
const handleCreateAirLine = async (req, res) => {
    if (!req?.body) return res.sendStatus(400)
    const value = JSON.parse(req.body.values)
    const imageInfo = req.files

    // console.log(imageInfo)
    const images = imageInfo.map((item) => ({
        name: item.originalname,
        data: item.buffer,
        contentType: item.mimetype,
    }))

    try {
        await AirLine.create({ ...value, img: images })
        res.sendStatus(201)
    } catch (e) {
        res.status(500).json(e.message)
    }
}

const handleDeleteAirLine = async (req, res) => {
    const airLineID = req.params.id

    //find and delete AirLine in DB by userID
    const currentAirLine = await AirLine.findByIdAndDelete({ _id: airLineID })

    if (!currentAirLine) {
        res.status(501).json({ message: ' AirLine cant be deleted' })
    } else {
        res.status(200).json({ message: 'AirLine deleted successfully' })
    }
}

const handleUpdateAirLine = async (req, res) => {
    if (!req.params.id && !req?.body) return res.sendStatus(400)

    const airLineID = req.params.id
    const value = JSON.parse(req.body.values)
    const imageInfo = req.files

    const images = imageInfo.map((item) => ({
        name: item.originalname,
        data: item.buffer,
        contentType: item.mimetype,
    }))

    // find and update Hotel by ID
    const currentAirLine = await AirLine.findById(airLineID).exec()

    try {
        await currentAirLine.updateOne(
            { ...value, img: images },
            { ...currentAirLine }
        )

        res.status(200).json({
            message: 'AirLine update successfully',
        })
    } catch (e) {
        res.status(200).json({ message: 'AirLine cant be update' })
    }
}

module.exports = {
    handleAllAirLines,
    handleAirLine,
    handleCreateAirLine,
    handleDeleteAirLine,
    handleUpdateAirLine,
}
