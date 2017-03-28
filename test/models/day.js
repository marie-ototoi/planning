const chai = require('chai')
const Day = require('../../models/day')
const expect = chai.expect

chai.use(require('chai-datetime'))

describe('Model Day - ', function () {
    before(function () {
        return Day.configCalendar('2014-04-03', '2016-03-31')
    })
    it('should return an array of days in chronological order', function () {
        return Day.getDays()
        .then(days => {
            expect(days).to.be.instanceof(Array)
            // pick random day to check properties
            let index = Math.floor(Math.random() * days.length)
            expect(days[index]).to.have.property('date').that.is.a('date')
            expect(days[index]).to.have.property('morning').with.lengthOf(2)
            expect(days[index]).to.have.property('afternoon').with.lengthOf(2)
            // check if first date is before last date
            expect(days[0].date).to.beforeDate(days[days.length - 1].date)
        })
    })
    it('should return requested date', function () {
        return Day.getDay('2015-04-03')
        .then(getThisDay => {
            expect(getThisDay._id).to.equal('2015-04-03')
        })
    })
    it('should return the first date', function () {
        return Day.getFirstDay()
        .then(firstDay => {
            expect(firstDay[0]._id).to.equal('2014-04-03')
        })
    })
    it('should return the last date', function () {
        return Day.getLastDay()
        .then(lastDay => {
            expect(lastDay[0]._id).to.equal('2016-03-31')
        })
    })

    it('should change the location of a date', function () {
        return Day.findOrCreate('2014-04-03', 'SC', 'HO')
        .then(setThisDay => {
            return Day.getDay('2014-04-03')
            .then(getThisDay => {
                expect(getThisDay.morning).to.equal('SC')
                expect(getThisDay.afternoon).to.equal('HO')
            })
        })
    })
})
