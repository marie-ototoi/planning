process.env.NODE_ENV = 'test'

//require('dotenv').config()
//require('../models/connection')

/*let jsdom = require('jsdom').jsdom

let exposedProperties = ['window', 'navigator', 'document']

global.document = jsdom('<html><head></head><body></body></html>')
global.window = document.defaultView
Object.keys(document.defaultView).forEach((property) => {
    if (typeof global[property] === 'undefined') {
        exposedProperties.push(property)
        global[property] = document.defaultView[property]
    }
})

global.navigator = {
    userAgent: 'node.js'
}

let documentRef = document*/


require('./controllers/app.spec')
//require('./models/day')
//require('./models/CalendarStream')
//require('./components/Timeline.spec')
//require('./components/d3Timeline.spec')