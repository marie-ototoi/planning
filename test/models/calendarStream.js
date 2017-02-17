const CalendarStream = require('../../models/calendarStream'),
    chai = require('chai'),
    expect = chai.expect,
    fs = require('fs'),
    rp = require('request-promise')


chai.use(require('chai-datetime'))

describe('Model CalendarStream - ', function() {
    this.timeout(5000)
    
    let icalData

	it('should load remote ical stream', function(done) {     
        //
        rp({uri : 'http://p53-calendars.icloud.com/published/2/SI9lZaSUYZZCZfA4SiWgGO1gHWVCUYZV4tPi2HoWGiwM5PY5KyXgDz42F8a5dA85iyGtkqr12PjPdyaRKsqDD5wM55EkxXRfr31HIYYYy-A'})
        .then( data => {
            icalData = data
            expect(data.substring(0,15)).to.equal('BEGIN:VCALENDAR')
            done()
        })
        .catch(err=>{
            console.error('Error loading ical test data' + err)
        })
    })
    it('should parse a calendar', function(done) {     

        CalendarStream.parseCalendarData(icalData)
        .then( calendar =>{
            //pick random day to check properties
            let index = Math.floor(Math.random() * calendar.length)
            expect(calendar[index]).to.have.property('summary')
            expect(calendar[index]).to.have.property('startDate')
            done()
        })
        .catch( err =>{
            console.error('Error parsing ical data' + err)
        })
    })
    it('should load and parse a calendar', function(done) {     
        //
        CalendarStream.getCalendarData('http://p53-calendars.icloud.com/published/2/SI9lZaSUYZZCZfA4SiWgGO1gHWVCUYZV4tPi2HoWGiwM5PY5KyXgDz42F8a5dA85iyGtkqr12PjPdyaRKsqDD5wM55EkxXRfr31HIYYYy-A')
        .then( calendar =>{

            //pick random day to check properties
            let index = Math.floor(Math.random() * calendar.length)
            expect(calendar[index]).to.have.property('summary')
            expect(calendar[index]).to.have.property('startDate')
            done()
        })
        .catch( err =>{
            console.error('Error retrieving and parsing ical data' + err)
        })
    })
    it('should create a calendar entry', function() {
        CalendarStream.findOrCreate('http://p53-calendars.icloud.com/published/2/SI9lZaSUYZZCZfA4SiWgGO1gHWVCUYZV4tPi2HoWGiwM5PY5KyXgDz42F8a5dA85iyGtkqr12PjPdyaRKsqDD5wM55EkxXRfr31HIYYYy-A')
        .then(setThisDay =>{
            Day.getDay(setThisDay._id)
            .then(getThisDay =>{
                expect(getThisDay[0].morning).to.equal('SC')
                expect(getThisDay[0].afternoon).to.equal('HO')

            })
        })
        .catch(err=>{
            console.error(err)
        })
    })
})