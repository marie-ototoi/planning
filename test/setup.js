require('babel-register')()
// process.env.NODE_ENV = 'test'

let jsdom = require('jsdom').jsdom

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

let documentRef = document
