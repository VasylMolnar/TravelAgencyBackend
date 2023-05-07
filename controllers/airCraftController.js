const AirCraft = require('../model/AirCraft')

//admin and user
//by AirLIne Id
const handleAllAirCraft = async (req, res) => {
    if (!req.params) return res.sendStatus(400)
    const { id: airLineId } = req.params

    //find All AirCraft by AirLine ID
    const currentRooms =
        (await AirCraft.findOne({ airLineId: airLineId }).exec()) || []

    if (!currentRooms) {
        res.status(500).json({ message: 'List is empty' })
    } else {
        const rooms =
            currentRooms?.airLinePlane?.map((item) => {
                return {
                    id: item._id,
                    departure: item.departure,
                    arrival: item.arrival,
                    price: item.price,
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
    const airLineList = await AirCraft.findOne({
        airLineId: parsedUrl[0],
    }).exec()

    if (!airLineList) {
        res.status(404).json({ message: 'AirLine list not found' })
    } else {
        //find Current Room  by Room Id
        const currentAirCraft = airLineList.airLinePlane.find(
            (airCraft) => airCraft._id.toString() === parsedUrl[1]
        )

        currentAirCraft
            ? res.status(200).send(currentAirCraft)
            : res.status(404).json({ message: 'AirLine not found' })
    }
}

//admin
//by AirLine Id
const handleCreateAirCraft = async (req, res) => {
    if (!req?.body || !req.params) return res.sendStatus(400)
    const value = JSON.parse(req.body.values)
    const { id: airLineId } = req.params

    const imageInfo = req.files

    const images = imageInfo.map((item) => ({
        name: item.originalname,
        data: item.buffer,
        contentType: item.mimetype,
    }))
    value.airLinePlane[0].img = images

    //find Room collections by Hotel Id
    let airLineCollection = await AirCraft.findOne({
        airLineId: airLineId,
    }).exec()

    if (airLineCollection) {
        try {
            airLineCollection.airLinePlane.push(value.airLinePlane[0])
            await airLineCollection.save()

            res.sendStatus(201)
        } catch (e) {
            res.status(500).json(e.message)
        }
    } else {
        try {
            await AirCraft.create({ ...value })
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
    let airLineList = await AirCraft.findOne({
        airLineId: parsedUrl[0],
    }).exec()

    if (!airLineList) {
        res.status(404).json({ message: 'AirCraft list not found' })
    } else {
        //find Current airCraft by airCraft Id and delete
        airLineList.airLinePlane = airLineList.airLinePlane.filter(
            (airCraft) => airCraft._id.toString() !== parsedUrl[1]
        )

        try {
            await airLineList.save()
            res.status(200).json({ message: 'AirCraft deleted successfully' })
        } catch (e) {
            res.status(404).json({ message: 'AirCraft cant be deleted ' })
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
    let airLineList = await AirCraft.findOne({ airLineId: parsedUrl[0] }).exec()

    if (!airLineList) {
        res.status(404).json({ message: 'AirLine list not found' })
    } else {
        //find Current Room  by Room Id and update

        airLineList.airLinePlane = airLineList.airLinePlane.map((airCraft) => {
            return airCraft._id.toString() === parsedUrl[1]
                ? { ...airCraft, ...newValue, img: images }
                : airCraft
        })

        try {
            await airLineList.save()
            res.status(200).json({ message: 'AirCraft update successfully' })
        } catch (e) {
            res.status(404).json({ message: 'AirCraft cant be update ' })
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
