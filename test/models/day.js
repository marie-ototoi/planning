const chai = require('chai'),
    expect = chai.expect,
    Day = require('../../models/day')


chai.use(require('chai-datetime'))

describe('Model Day - ', function() {
	before(function(){
        return  Day.configCalendar("2014-04-03", "2016-03-31") 
    })
	it('should return an array of days in chronological order', function() {
        Day.getDays()
        .then(days =>{
            expect(days).to.be.instanceof(Array)
            //pick random day to check properties
            let index = Math.floor(Math.random() * days.length)
            expect(days[index]).to.have.property('date').that.is.a('date')
            expect(days[index]).to.have.property('type').with.lengthOf(2)
            //check if first date is before last date
            expect(days[0].date).to.beforeDate(days[days.length-1].date)
        })   
    })
    it('should return the first date', function() {
        Promise.all([Day.getDays(), Day.getFirstDay()])
        .then(([days, firstDay]) =>{
            expect(firstDay[0].date).to.equalDate(days[0].date)
        })
    })
    it('should return the last date', function() {
        Promise.all([Day.getDays(), Day.getLastDay()])
        .then(([days, lastDay]) =>{
            expect(lastDay[0].date).to.equalDate(days[days.length-1].date)
        })
    })
    
})