const CallCenter = require('../model/CallCenter')

const handleAllMessage = async (req, res) => {
    //find All
    const allMessages = await CallCenter.find().exec()
    res.status(200).json(allMessages)
}

const handleCreate = async (req, res) => {
    if (!req?.body) return res.sendStatus(400)

    const value = req.body

    try {
        await CallCenter.create({ ...value })
        res.sendStatus(201)
    } catch (e) {
        res.status(500).json(e.message)
    }
}

const handleDelete = async (req, res) => {
    if (!req.params.id) return res.sendStatus(400)

    const id = req.params.id
    console.log(id)

    try {
        await CallCenter.findByIdAndDelete({ _id: id })
        res.sendStatus(200)
    } catch (e) {
        res.status(500).json(e.message)
    }
}

module.exports = {
    handleAllMessage,
    handleCreate,
    handleDelete,
}
