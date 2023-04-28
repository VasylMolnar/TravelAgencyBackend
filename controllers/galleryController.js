const Gallery = require('../model/Gallery')

//All User
const handleAllGallery = async (req, res) => {
    //return all Gallery List
    const galleryList = (await Gallery.find().exec()) || []

    galleryList
        ? res.status(200).json(galleryList)
        : res.status(501).json({ message: 'Gallery not found' })
}

//Auth User
const handleGallery = async (req, res) => {
    const userID = req.params.id
    if (!userID) return res.status(401)

    //find Current Gallery List By User ID

    const galleryList = (await Gallery.findOne({ userID }).exec()) || []

    galleryList
        ? res.status(200).json(galleryList)
        : res.status(501).json({ message: 'Gallery not found' })
}

const handleCreate = async (req, res) => {
    if (!req?.body) return res.sendStatus(400)

    const value = JSON.parse(req.body.values)

    const imageInfo = req.files
    const images = imageInfo.map((item) => ({
        name: item.originalname,
        data: item.buffer,
        contentType: item.mimetype,
    }))

    try {
        await Gallery.create({ ...value, img: images })
        res.sendStatus(201)
    } catch (e) {
        res.status(500).json(e.message)
    }
}

const handleUpdate = (req, res) => {}

const handleDelete = (req, res) => {}

module.exports = {
    handleAllGallery,
    handleGallery,
    handleCreate,
    handleUpdate,
    handleDelete,
}
