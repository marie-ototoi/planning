const mongoose = require('mongoose')

mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1/otoplanning')

const db = mongoose.connection
db.on('error', () => {
    console.error('✘ CANNOT CONNECT TO mongoDB DATABASE otoplanning !')
})

module.exports = function listenToConnectionOpen (onceReady) {
    if (onceReady) {
        db.on('open', onceReady)
    }
}