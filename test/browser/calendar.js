const expect = require('chai').expect,
    MockBrowser = require('mock-browser').mocks.MockBrowser,
    mock = new MockBrowser(),
    d3 = require('d3'),
    timeformat = require('d3-time-format'),
    formatDay = d3.timeFormat("%Y-%m-%d")

global.document = mock.getDocument()

const calendar = require('../../browser/scripts/calendar')


describe('Calendar - check data', function() {

    let initCalendar

	before(function() {        
		// runs before all tests in this block
        initCalendar = calendar.init([{"date":"2017-04-01", "type":"IL"},{"date":"2017-04-02", "type":"IL"},{"date":"2017-04-03", "type":"LO"}])
	})
	it('should receive an array of objects, with dates and types', function() {
        expect(initCalendar.data).to.be.instanceof(Array)
        expect(initCalendar.data[0]).to.have.property('date').with.lengthOf(10);
        expect(initCalendar.data[0]).to.have.property('type').with.lengthOf(2);
    })   
	it('should convert date strings to js date objects', function() {
        expect(initCalendar.newData[0].date).to.be.a('date')
    })
    it('should set the starting date', function() {
        expect(initCalendar.dateStart).to.be.a('date')
        expect(formatDay(initCalendar.dateStart)).to.equal(formatDay(initCalendar.newData[0].date))
    })
    it('should set the ending date', function() {
      	expect(initCalendar.dateEnd).to.be.a('date')
        expect(formatDay(initCalendar.dateEnd)).to.equal(formatDay(initCalendar.newData[initCalendar.newData.length - 1].date))
    })
	it('should set the current date', function() {
      	expect(initCalendar.dateNow).to.be.a('date')
  		expect(formatDay(initCalendar.dateNow)).to.equal(formatDay(new Date()))
    })

})