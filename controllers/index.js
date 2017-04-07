const express = require('express')
const User = require('../models/user')

const router = express.Router()

router.use('/', require('./calendar'))
router.use('/users', require('./users'))
router.use('/config', require('./config'))

module.exports = router
