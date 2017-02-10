const expect = require('chai').expect,
    MockBrowser = require('mock-browser').mocks.MockBrowser,
    mock = new MockBrowser(),
    d3 = require('d3'),
    timeformat = require('d3-time-format'),
    formatDay = d3.timeFormat("%Y-%m-%d"),
    formatYearMonth = d3.timeFormat("%Y-%m"), 
    Day = require('../../models/day')

global.document = mock.getDocument()

const calendar = require('../../browser/scripts/calendar')


describe('Calendar - check data', function() {

    let initCalendar

	before(function(done) {
        Day.configCalendar('2014-04-03', '2016-03-31')
        .then((results)=>{
            Day.getDays()
            .then(days => {
                initCalendar = calendar.init(days)
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
	it('should receive an array of objects, with dates and types', function() {
        expect(initCalendar.rawData).to.be.instanceof(Array)
        expect(initCalendar.rawData[0]).to.have.property('_id').with.lengthOf(10);
        expect(initCalendar.rawData[0]).to.have.property('type').with.lengthOf(2);
        expect(initCalendar.rawData[0].date).to.be.a('date')
    })
    it('should set the starting date', function() {
        expect(initCalendar.dateStart).to.be.a('date')
        expect(formatDay(initCalendar.dateStart)).to.equal(formatDay(new Date('2014-04-03')))
    })
    it('should set the ending date', function() {
      	expect(initCalendar.dateEnd).to.be.a('date')
        expect(formatDay(initCalendar.dateEnd)).to.equal(formatDay(new Date('2016-03-31')))
    })
	it('should set the current date', function() {
      	expect(initCalendar.dateNow).to.be.a('date')
  		expect(formatDay(initCalendar.dateNow)).to.equal(formatDay(new Date()))
    })
    it('should return next month if available in the data', function() {
        calendar.requestCalendar(new Date('2014-04-03'))
        let requestedMonth = calendar.requestCalendar(null, 'next')
        expect(formatYearMonth(requestedMonth)).to.equal('2014-05')

    })
    it('should return current month if next month is not available in the data', function() {
        calendar.requestCalendar(new Date('2016-03-31'))
        let requestedMonth = calendar.requestCalendar(null, 'next')
        expect(formatYearMonth(requestedMonth)).to.equal('2016-03')
    })
    it('should return previous month if available in the data', function() {
        calendar.requestCalendar(new Date('2014-05-03'))
        let requestedMonth = calendar.requestCalendar(null, 'previous')
        expect(formatYearMonth(requestedMonth)).to.equal('2014-04')
    })
    it('should return the current month if available in the data', function() {
        calendar.requestCalendar(new Date('2014-04-03'))
        let requestedMonth = calendar.requestCalendar(null, 'previous')
        expect(formatYearMonth(requestedMonth)).to.equal('2014-04')
    })
    it('should return first available month if requested Date is not in the data', function() {
        let requestedMonth = calendar.requestCalendar(new Date('2018-04-03'))
        expect(formatYearMonth(requestedMonth)).to.equal('2014-04')
    })
})