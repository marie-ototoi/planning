const CalendarStream = require('../../models/calendarStream'),
    chai = require('chai'),
    expect = chai.expect,
    fs = require('fs'),
    rp = require('request-promise')


chai.use(require('chai-datetime'))

describe('Model CalendarStream - ', function() {
    this.timeout(10000)
    
    let icalData
    let calendars
    
    before(function(done){
        calendars = [{
            _id : '1',
            url : 'http://p53-calendars.icloud.com/published/2/SI9lZaSUYZZCZfA4SiWgGO1gHWVCUYZV4tPi2HoWGiwM5PY5KyXgDz42F8a5dA85iyGtkqr12PjPdyaRKsqDD5wM55EkxXRfr31HIYYYy-A'}
        ]
        done()
    })

	it('should load remote ical stream', function(done) {     
        //

        rp({uri : calendars[0].url})
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
            expect(calendar[index]).to.have.property('dateStart')
            done()
        })
        .catch( err =>{
            console.error('Error parsing ical data' + err)
        })
    })
    it('should load and parse a calendar', function(done) {     
        //
        CalendarStream.getCalendarData(calendars[0].url)
        .then( calendar =>{

            //pick random day to check properties
            let index = Math.floor(Math.random() * calendar.length)
            expect(calendar[index]).to.have.property('summary')
            expect(calendar[index]).to.have.property('dateStart')
            done()
        })
        .catch( err =>{
            console.error('Error retrieving and parsing ical data' + err)
        })
    })
    it('should create a calendar entry', function(done) {
        CalendarStream.findOrCreate(calendars[0]._id, calendars[0].url)
        .then(setThisCalendar =>{
            CalendarStream.getCalendar(calendars[0]._id)
            .then(getThisCalendar =>{
                expect(getThisCalendar[0].url).to.equal(calendars[0].url)
                done()
            })
            .catch(err=>{
                console.error(err)
            })
        })
        .catch(err=>{
            console.error(err)
        })
    })
})