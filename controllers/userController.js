const User = require('../model/User')
const bcrypt = require('bcrypt')

//admin and user
const handleDelete = async (req, res) => {
    const userID = req.params.id

    //find and delete user in DB by userID
    const currentUser = await User.findOneAndDelete({ _id: userID }).exec()

    !currentUser
        ? res.status(501).json({ message: 'User cant be deleted' })
        : res.status(200).json({ message: 'User successfully deleted' })
}

const handleUpdate = async (req, res) => {
    const userID = req.params.id
    const updateData = req.body

    //hashed PWD
    const hashedPwd = await bcrypt.hash(updateData.password, 10)

    //find and update user in DB by userID
    const currentUser = await User.findByIdAndUpdate(
        { _id: userID },
        { ...updateData, password: hashedPwd }
    ).exec()

    !currentUser
        ? res.status(501).json({ message: 'User cant be update' })
        : res.status(200).json({ message: 'User successfully update' })
}

//admin
const handleUserById = async (req, res) => {
    const userID = req.params.id

    //find and Get user by Id in DB
    const currentUser = await User.findOne({ _id: userID }).exec()

    !currentUser
        ? res.status(501).json({ message: 'User not found' })
        : res.status(200).json(currentUser)
}

const handleAllUsers = async (req, res) => {
    //return all list Users
    const listOfUsers = await User.find().exec()

    !listOfUsers
        ? res.status(0).json({ message: 'List is empty' })
        : res.status(200).json(listOfUsers)
}

module.exports = {
    handleDelete,
    handleUpdate,
    handleAllUsers,
    handleUserById,
}
