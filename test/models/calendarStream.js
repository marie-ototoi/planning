const CalendarStream = require('../../models/calendarStream')
const chai = require('chai')
const rp = require('request-promise')

const expect = chai.expect

chai.use(require('chai-datetime'))

describe('Model CalendarStream - ', function () {
    this.timeout(10000)

    let icalData
    let calendars

    before(function () {
        calendars = [{
            _id: '1',
            url: 'http://p53-calendars.icloud.com/published/2/SI9lZaSUYZZCZfA4SiWgGO1gHWVCUYZV4tPi2HoWGiwM5PY5KyXgDz42F8a5dA85iyGtkqr12PjPdyaRKsqDD5wM55EkxXRfr31HIYYYy-A'
        }]
        return rp({uri: calendars[0].url})
        .then(data => {
            icalData = data
        })
    })

    it('should load remote ical stream', function () {
        expect(icalData.substring(0, 15)).to.equal('BEGIN:VCALENDAR')
    })
    it('should parse a calendar', function () {
        return CalendarStream.parseCalendarData(icalData)
        .then(calendar => {
            // pick random day to check properties
            let index = Math.floor(Math.random() * calendar.length)
            expect(calendar[index]).to.have.property('summary')
            expect(calendar[index]).to.have.property('dateStart')
        })
    })
    it('should load and parse a calendar', function () {
        return CalendarStream.getCalendarData(calendars[0].url)
        .then(calendar => {
            // pick random day to check properties
            let index = Math.floor(Math.random() * calendar.length)
            expect(calendar[index]).to.have.property('summary')
            expect(calendar[index]).to.have.property('dateStart')
        })
    })
    it('should create a calendar entry', function () {
        return CalendarStream.findOrCreate(calendars[0]._id, calendars[0].url)
        .then(setThisCalendar => {
            return CalendarStream.getCalendar(calendars[0]._id)
            .then(getThisCalendar => {
                expect(getThisCalendar[0].url).to.equal(calendars[0].url)
            })
        })
    })
})
