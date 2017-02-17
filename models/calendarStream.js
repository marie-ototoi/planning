const mongoose = require('mongoose'),
    rp = require('request-promise'),
    icalParser = require('ical.js')

mongoose.Promise = global.Promise

const calendarStreamSchema = new mongoose.Schema({
    url: { type: String, required: true },
    createdAt : { type: Date },
    modifiedAt : { type: Date }
})


calendarStreamSchema.statics.getCalendar = function getCalendar (url) {
    return this.find({url}).exec()
}

calendarStreamSchema.statics.getCalendars = function getCalendars (properties) {
    return this.find({}, properties).sort({_id: 1 }).exec()
}

calendarStreamSchema.statics.getAllCalendarsData = function getAllCalendarsData (url) {
    
}
calendarStreamSchema.statics.getCalendarData = function getCalendarData (url) {
    //return this.parseCalendarData(url)
    return rp(url)
    .then(icalData =>{
        return this.parseCalendarData(icalData)
    })
    .catch(err=>{
        console.error('Error loading ical data' + err)
    })
}
calendarStreamSchema.statics.normaliseDatePart = function normaliseDatePart (datePart) {
    return (Number(datePart) < 10) ? '0' + datePart : datePart
}
calendarStreamSchema.statics.parseCalendarData = function parseCalendarData (icalData) {
    return new Promise((resolve, reject) => {
        let data = icalParser.parse(icalData)
        if(data[0] === 'vcalendar'){
            //console.log('toto')
            let parser = new icalParser.ComponentParser({ parseEvent: true, parseTimezone: false })
            let events = []
            let normaliseDatePart = this.normaliseDatePart
            parser.onevent = function (eventComponent) {
                let component = new icalParser.Component(eventComponent.component.jCal)
                let event = new ICAL.Event(component)
                events.push({
                    dateStart : eventComponent.startDate._time,
                    dateEnd : eventComponent.endDate._time,
                    summary : eventComponent.summary
                })
            }
            parser.oncomplete = function () {
                //console.log('events', events)
                resolve(events)
            }
            parser.process(data)
        }else{
            reject()
        }
    })
}

const Model = mongoose.model('CalendarStream', calendarStreamSchema)

module.exports = Model