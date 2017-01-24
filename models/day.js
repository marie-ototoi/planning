const mongoose = require('mongoose'),
momentLib = require('moment'),
momentRange = require('moment-range'),
moment = momentRange.extendMoment(momentLib)

const daySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    createdAt : { type: Date },
    modifiedAt : { type: Date }
})

daySchema.statics.findOrCreate = function findOrCreate (id, type, done) {
    this.update(
        { _id: id },
        { $set: { date : id, type, modifiedAt : Date.now() }, $setOnInsert: { createdAt: Date.now() } },
        { upsert: true },
        // Forwarder l'erreur éventuelle, mais à défaut transmettre l'id comme valeur résultante.
        (err) => done(err, id)
    )
}

daySchema.statics.getDays = function getDays (properties) {
    return this.find({}, properties).sort({_id: 1 }).exec()
}

daySchema.statics.getFirstDay = function getFirstDay () {
    return this.find({}, '_id').limit(1).sort({_id: 1 }).exec()
}

daySchema.statics.getLastDay = function getLastDay () {
    return this.find({}, '_id').limit(1).sort({_id: -1 }).exec()
}

daySchema.statics.configCalendar = function configCalendar (dayStart, dayEnd) {
    // delete all documents before new start
    this.remove({date: { $lt: new Date( moment(dayStart).format('YYYY-MM-DD') + 'T00:00:00.000Z') }}).exec() 
    // delete all documents after new end
    this.remove({date: { $gt: new Date(  moment(dayEnd).format('YYYY-MM-DD') + 'T00:00:00.000Z') }}).exec() 
    //
    //console.log('K ', 'ISODate("' + moment(dayStart).format('YYYY-MM-DD') + 'T00:00:00.000Z")')
    const newRange = moment.range(dayStart, dayEnd)
    for (let eachDay of newRange.by('day')) {
        // create document if does not exists
        let that = this
        this.findById(eachDay.format('YYYY-MM-DD'), function(err, thisDay){
            if(thisDay === null){
                let type 
                let dayOfTheWeek = Number(eachDay.format('e'))
                if(dayOfTheWeek === 1 || dayOfTheWeek === 2) {
                    type = 'IL'
                }else if(dayOfTheWeek === 4 || dayOfTheWeek === 5) {
                    type = 'LO'
                }else if(dayOfTheWeek === 3) {
                    type = (Number(eachDay.format('W')) % 2 === 0) ? 'IL' : 'LO'
                }else if(dayOfTheWeek === 0 || dayOfTheWeek === 6) {
                    type = 'HO'
                }
                that.update(
                    { _id: eachDay.format('YYYY-MM-DD') },
                    { $set: { date : eachDay.format('YYYY-MM-DD'), type, createdAt: Date.now() }},
                    { upsert: true },
                    function(err){}
                )
            }
        })
    }
}

daySchema.methods.setDay = function setDay (id) {
    
}

daySchema.methods.getDay = function getDay (id) {
    
}

const Model = mongoose.model('Day', daySchema)

module.exports = Model
