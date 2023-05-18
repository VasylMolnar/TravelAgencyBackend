const router = require('express').Router()
const CallCenterController = require('../controllers/callCenterController')
const verifyRoles = require('../middleware/verifyRoles')
const roles = require('../config/roles_list')

router.get(
    '/',
    verifyRoles(roles.Admin, roles.CallCenter),
    CallCenterController.handleAllMessage
)

router.post('/', CallCenterController.handleCreate)

router.delete('/:id', CallCenterController.handleDelete)

module.exports = router
