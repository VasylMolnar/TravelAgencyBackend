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
        title: value.title,
    }))

    try {
        await Gallery.create({ ...value, img: images })
        res.sendStatus(201)
    } catch (e) {
        res.status(500).json(e.message)
    }
}

const handleUpdate = async (req, res) => {
    if (!req._parsedUrl.path && req.body) return res.sendStatus(400)

    const newReactions = req.body.newReactions
    console.log('', newReactions)

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find Current Gallery List by User ID
    const currentList = await Gallery.findOne({ userID: parsedUrl[0] })

    if (!currentList) {
        res.status(404).json({ message: 'IMG list not found' })
    } else {
        currentList.img = currentList.img.map((item) => {
            return item._id.toString() === parsedUrl[1]
                ? { ...item, reactions: { ...newReactions } }
                : item
        })

        try {
            await currentList.save()
            res.status(200).json({ message: 'IMG update successfully' })
        } catch (e) {
            res.status(404).json({ message: 'IMG cant be update ' })
        }
    }
}

const handleDelete = async (req, res) => {
    if (!req._parsedUrl.path) return res.sendStatus(400)

    const parsedUrl = req._parsedUrl.path
        .split('/')
        .filter((item) => item !== '')

    //find Current Gallery List by User ID
    const currentList = await Gallery.findOne({ userID: parsedUrl[0] })

    if (!currentList) {
        res.status(404).json({ message: 'IMG list not found' })
    } else {
        currentList.img = currentList.img.filter(
            (item) => item._id.toString() !== parsedUrl[1]
        )

        try {
            await currentList.save()
            res.status(200).json({ message: 'IMG deleted successfully' })
        } catch (e) {
            res.status(404).json({ message: 'IMG cant be deleted ' })
        }
    }
}

module.exports = {
    handleAllGallery,
    handleGallery,
    handleCreate,
    handleUpdate,
    handleDelete,
}
