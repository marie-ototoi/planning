const expect = require('chai').expect
	

//global.document.data = [{"date":"2017-04-01", "type":"IL"},{"date":"2017-04-02", "type":"IL"},{"date":"2017-04-03", "type":"LO"}]

const calendar = require('../../browser/scripts/calendar.js')


describe('Calendar', function() {
	describe('check data', function() {

		before(function() {
			// runs before all tests in this block
		
		})
		it('should find data', function() {
      		expect(calendar.dateStart).to.be.a('date')
    	})
    	it('should set the starting date', function() {
      		expect(calendar.dateStart).to.be.a('date')
    	})
    	it('should set the ending date', function() {
      		expect(calendar.dateEnd).to.be.a('date')
    	})
    	it('should set the current date', function() {
      		expect(calendar.dateNow).to.be.a('date')
      		expect(calendar.dateNow).to.equal(new Date())
    	})
    })
})