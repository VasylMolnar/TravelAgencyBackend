const router = require('express').Router()
const handleTokenRefresh = require('../controllers/refreshTokenController')

router.get('/', handleTokenRefresh.handleTokenRefresh)

module.exports = router
