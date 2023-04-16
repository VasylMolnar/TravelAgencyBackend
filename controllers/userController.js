const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//admin and user
const handleDelete = async (req, res) => {
    const userID = req.params.id
    const roles = req.headers.roles.split(',')

    //find and delete user in DB by userID
    const currentUser = await User.findOneAndDelete({ _id: userID }).exec()

    if (!currentUser) {
        res.status(501).json({ message: 'User cant be deleted' })
    } else {
        res.status(200).json({ message: 'User successfully deleted', roles })
    }
}

const handleUpdate = async (req, res) => {
    const userID = req.params.id
    const updateData = { ...req.body }

    //find current User by id
    const currentUser = await User.findById(userID)

    //hashed PWD if user change password
    if (currentUser.password !== updateData.password) {
        updateData.password = await bcrypt.hash(updateData.password, 10)
    }

    //change Refresh token if User change Email (because we decode email in Access Token and if we not change Refresh we have 404 in refreshTokenController)
    //decode email !== User.email(user email change in client)
    if (currentUser.email !== updateData.email) {
        updateData.refreshToken = jwt.sign(
            { email: updateData.email }, //decoded new Email for refreshTokenController
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )

        res.cookie('jwt', updateData.refreshToken, {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
            maxAge: 24 * 60 * 60 * 1000,
        })
    }

    //save update data to User
    try {
        await currentUser.updateOne({ ...updateData }, { ...currentUser })

        res.status(200).json({
            message: 'User successfully update',
        })
    } catch (e) {
        res.status(501).json({ message: 'User cant be update' })
    }
}

//admin
const handleUserById = async (req, res) => {
    const userID = req.params.id

    //find and Get user by Id in DB
    const currentUser = await User.findById({
        _id: userID,
    }).exec()

    const { id, username, email, date, avatar, password } = currentUser

    !currentUser
        ? res.status(501).json({ message: 'User not found' })
        : res.status(200).json({ id, username, email, date, avatar, password })
}

const handleAllUsers = async (req, res) => {
    //return all list Users
    const listOfUsers = (await User.find().exec()).map((item) => {
        return {
            id: item._id,
            username: item.username,
            email: item.email,
            date: item.date,
        }
    })

    !listOfUsers
        ? res.status(500).json({ message: 'List is empty' })
        : res.status(200).json(listOfUsers)
}

const handleUploadImg = async (req, res) => {
    const userID = req.params.id
    const imagePath = req.file.path.split('uploads')[1]
    const folderToSave = req.body.folder

    console.log(imagePath)

    //find User
    const currentUser = await User.findById({ _id: userID }).exec()
    if (!currentUser) res.status(501).json({ message: 'User not found' })

    try {
        folderToSave === 'Avatar'
            ? (currentUser.avatar = imagePath)
            : (currentUser.gallery = imagePath)

        await currentUser.save()

        res.status(201).json({
            message: 'Зображення успішно завантажено на сервер!',
        })
    } catch (e) {
        res.status(501).json({
            message: e,
        })
    }
}

module.exports = {
    handleDelete,
    handleUpdate,
    handleAllUsers,
    handleUserById,
    handleUploadImg,
}
