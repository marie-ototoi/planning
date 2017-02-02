process.env.NODE_ENV = "test"

require('dotenv').config()

const dbConnect = require('../models/connection'),
	calendar = require('./browser/calendar'),
	day = require('./models/day')
