const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

//admin and user
const handleDelete = async (req, res) => {
    const userID = req.params.id

    //find and delete user in DB by userID
    const currentUser = await User.findOneAndDelete({ _id: userID }).exec()

    if (!currentUser) {
        res.status(501).json({ message: 'User cant be deleted' })
    } else {
        res.status(200).json({ message: 'User successfully deleted' })
        res.clearCookie('jwt', {
            httpOnly: true,
            sameSite: 'None',
            secure: true,
        })
    }
}

const handleUpdate = async (req, res) => {
    const userID = req.params.id
    const updateData = { ...req.body }

    //hashed PWD
    updateData.password = await bcrypt.hash(updateData.password, 10)

    //find current User by id
    const currentUser = await User.findById(userID)

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
    const currentUser = await User.findOne({ _id: userID })
        .exec()
        .map((item) => {
            return {
                id: item._id,
                username: item.username,
                email: item.email,
                date: item.date,
            }
        })

    // console.log('', currentUser)

    !currentUser
        ? res.status(501).json({ message: 'User not found' })
        : res.status(200).json(currentUser)
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

module.exports = {
    handleDelete,
    handleUpdate,
    handleAllUsers,
    handleUserById,
}
