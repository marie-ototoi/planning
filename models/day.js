const mongoose = require('mongoose'),
momentLib = require('moment'),
momentRange = require('moment-range'),
moment = momentRange.extendMoment(momentLib)

mongoose.Promise = global.Promise

const daySchema = new mongoose.Schema({
    _id: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    createdAt : { type: Date },
    modifiedAt : { type: Date }
})

daySchema.statics.findOrCreate = function findOrCreate (id, type, done) {
    return this.update(
        { _id: id },
        { $set: { date : id, type, modifiedAt : Date.now() }, $setOnInsert: { createdAt: Date.now() } },
        { upsert: true }
    )
}

daySchema.statics.getDays = function getDays (properties) {
    return this.find({}, properties).sort({_id: 1 }).exec()
}

daySchema.statics.getFirstDay = function getFirstDay (properties) {
    return this.find({}, properties).limit(1).sort({_id: 1 }).exec()
}

daySchema.statics.getLastDay = function getLastDay (properties) {
    return this.find({}, properties).limit(1).sort({_id: -1 }).exec()
}

daySchema.statics.configCalendar = function configCalendar (dayStart, dayEnd) {
    
    let myPromises = []
    // delete all documents before new start
    myPromises.push( this.remove({date: { $lt: new Date( moment(dayStart).format('YYYY-MM-DD') + 'T00:00:00.000Z') }}).exec() )
    // delete all documents after new end
    myPromises.push( this.remove({date: { $gt: new Date(  moment(dayEnd).format('YYYY-MM-DD') + 'T00:00:00.000Z') }}).exec() )
    //
    const newRange = moment.range(dayStart, dayEnd)
    
    //comment éviter de faire ce truc crado ici ? (pour that.update plus bas)
    let that = this

    for (let eachDay of newRange.by('day')) {
       
        // check if document already exists
        let dayPromise = this.findById(eachDay.format('YYYY-MM-DD'))
        .then(day =>{
            //if not, add a promise to create it in the array of promises
            if(! day) {

                let type 
                //default rules to set the type property (location)
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
                return that.update(
                    { _id: eachDay.format('YYYY-MM-DD') },
                    { $set: { date : eachDay.format('YYYY-MM-DD'), type, createdAt: Date.now() }},
                    { upsert: true }
                )
            }
        })
        myPromises.push(dayPromise)
    }
    return Promise.all(myPromises)
}

daySchema.methods.updateDay = function updateDay (id, type) {
    return this.update(
        { _id: id },
        { $set: { type, modifiedAt : Date.now() }}
    )
}

const Model = mongoose.model('Day', daySchema)

module.exports = Model
