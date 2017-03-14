process.env.NODE_ENV = 'test'

require('dotenv').config()

const dbConnect = require('../models/connection'),
const calendar = require('./browser/calendar'),
const day = require('./models/day'),
const calendarStream = require('./models/CalendarStream')
