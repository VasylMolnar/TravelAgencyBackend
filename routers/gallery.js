const router = require('express').Router()
const galleryController = require('../controllers/galleryController')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')
const multer = require('multer')
const upload = multer()

//Get All Gallery List
router.get('/', galleryController.handleAllGallery)

//Get And Post Gallery List By User ID
router
    .route('/:id')
    .get(verifyRoles(roles.User), galleryController.handleGallery)
    .post(
        verifyRoles(roles.User),
        upload.array('image'),
        galleryController.handleCreate
    )

//Delete Update Img By User ID + Img ID
router
    .route('/:id/:id')
    .delete(verifyRoles(roles.User), galleryController.handleDelete)
    .put(verifyRoles(roles.User), galleryController.handleUpdate)

module.exports = router
