const chai = require('chai'),
    expect = chai.expect,
    Day = require('../../models/day')


chai.use(require('chai-datetime'))

describe('Model Day - ', function() {
	before(function(){
        return  Day.configCalendar('2014-04-03', '2016-03-31') 
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
    it('should return requested date', function() {
        Day.getDay('2015-04-03')
        .then(getThisDay =>{
            expect(getThisDay._id).to.equal('2015-04-03')
        })
        .catch(err=>{
            console.error(err)
        })  
    })
    it('should return the first date', function() {
        Day.getFirstDay()
        .then(firstDay =>{
            expect(firstDay[0]._id).to.equal('2014-04-03')
        })
        .catch(err=>{
            console.error(err)
        })  
    })
    it('should return the last date', function() {
        Day.getLastDay()
        .then(lastDay =>{
            expect(lastDay[0]._id).to.equal('2016-03-31')
        })
        .catch(err=>{
            console.error(err)
        })  
    })
    it('should change the type of a date', function() {
        Day.findOrCreate('2014-04-03', 'SC')
        .then(setThisDay =>{
            Day.getDay(setThisDay._id)
            .then(getThisDay =>{
                expect(getThisDay[0].type).to.equal('SC')
            })
        })
        .catch(err=>{
            console.error(err)
        })
    })
})