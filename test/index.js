process.env.NODE_ENV = 'test'

require('dotenv').config()

require('../models/connection')
require('./models/day')
require('./models/CalendarStream')
