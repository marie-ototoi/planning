const mongoose = require('mongoose')
const rp = require('request-promise')
const icalParser = require('ical.js')

mongoose.Promise = global.Promise

const calendarStreamSchema = new mongoose.Schema({
    _id: { type: Number, required: true },
    url: { type: String, required: true },
    createdAt: { type: Date },
    modifiedAt: { type: Date }
})

calendarStreamSchema.statics.findOrCreate = function findOrCreate (id, url) {
    return this.update(
    // Recherche
    { _id: id },
    // Mise à jour (l'id est supposé être celui de la recherche)
    { $set: { _id: id, url, modifiedAt: Date.now() }, $setOnInsert: { createdAt: Date.now() } },
    // Activation du mode upsert (insertion si non trouvé)
    { upsert: true }
  )
}

calendarStreamSchema.statics.getCalendar = function getCalendar (id) {
    return this.find({ _id: id }).exec()
}

calendarStreamSchema.statics.getCalendars = function getCalendars (properties) {
    return this.find({}, properties).sort({ _id: 1 }).exec()
}

calendarStreamSchema.statics.getAllCalendarsData = function getAllCalendarsData (url) {
    return this.getCalendars()
    .then(calendars => {
        return Promise.all(
            calendars.map((calendar, index) => {
                if (calendar.url !== '') return this.getCalendarData(calendar.url)
            })
        )
    })
}

calendarStreamSchema.statics.setCalendars = function setCalendars (calendars) {
    // return this.parseCalendarData(url)
    return Promise.all(
        calendars.map((calendar, index) => {
            if (calendar === '') {
                return this.remove({ _id: index }).exec()
            } else {
                return this.findOrCreate(index, calendar)
            }
        })
    )
}

calendarStreamSchema.statics.getCalendarData = function getCalendarData (url) {
    // return this.parseCalendarData(url)
    return rp(url)
    .then(icalData => {
        return this.parseCalendarData(icalData)
    })
}

calendarStreamSchema.statics.normaliseDatePart = function normaliseDatePart (datePart) {
    return (Number(datePart) < 10) ? '0' + datePart : datePart
}

calendarStreamSchema.statics.parseCalendarData = function parseCalendarData (icalData, limitDate) {
    return new Promise((resolve, reject) => {
        // console.log(icalData)
        let data = icalParser.parse(icalData)
        limitDate = limitDate ? limitDate : null

        let vcalendar = new icalParser.Component(data)
        let vevents = vcalendar.getAllSubcomponents('vevent')
        let events = []
        let exceptions = []
        vevents.forEach((vevent, i) => {
            let _event = new icalParser.Event(vevent)
            if (!limitDate) {
                let thisDate = _event.startDate.toJSDate()
                limitDate = thisDate.setDate(thisDate.getDate() + (365 * 3 + 1))
            }
            if (_event.isRecurring()) {
                // nothing, will be treated in the next loop when elements are gathered
            } else if (_event.isRecurrenceException()) {
                exceptions.push(_event)
            } else {
                // console.log("plain event", _event.summary, _event.startDate.toJSDate(), _event.endDate.toJSDate(), _event.uid)
                events.push({ dateStart: _event.startDate._time, dateEnd: _event.endDate._time, summary: _event.summary, dateStartJS: _event.startDate.toJSDate() })
            }
        })
        vevents.forEach((vevent, i) => {
            let _event = new icalParser.Event(vevent)

            if (_event.isRecurring()) {
                exceptions.forEach((ex) => {
                    _event.relateException(ex)
                })

                let iterator = _event.iterator()
                for (let next = iterator.next(); next; next = iterator.next()) {
                    let details = _event.getOccurrenceDetails(next)
                    // console.log("occurrence event",details.item.summary, details.startDate.toJSDate(), details.endDate.toJSDate())
                    events.push({ dateStart: details.startDate._time, dateEnd: details.endDate._time, summary: details.item.summary, dateStartJS: details.startDate.toJSDate() })

                    if (details.startDate.toJSDate() > limitDate) {
                        // console.log( details.startDate.toJSDate(), limitDate, details.startDate.toJSDate() > limitDate)
                        break
                    }
                }
            }
        })

        events = events.sort(function (a, b) {
            return a.dateStartJS < b.dateStartJS
        })
        resolve(events)
    })
}

const Model = mongoose.model('CalendarStream', calendarStreamSchema)

module.exports = Model
