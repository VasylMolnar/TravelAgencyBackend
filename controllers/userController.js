const User = require('../model/User')

const handleDelete = async (req, res) => {
    const userID = req.params.id

    //find Current user in DB by userID
    const currentUser = await User.findOne({ _id: userID }).exec()

    res.send(currentUser)
}

const handleUpdate = (req, res) => {}

module.exports = { handleDelete, handleUpdate }
