const chai = require('chai')
const expect = chai.expect

const calendar = require('../../controllers/calendar')

chai.use(require('chai-datetime'))

describe('App router - ', function () {
    let authorized = {}
    before(function () {
        // environment vars
        authorized.autorizedUsers = ['@epietriga', '@adimasci', '@nchauvat', '@OCayrol', '@Marla_da_Silva', '@JulietteTaka', '@mariepassage']
        authorized.adminUsers = ['@marie_ototoi']
    })
    it('should return a list of rights for the user', function () {
        expect(calendar.getUserRights({ '_id': '' }, authorized)).to.be.instanceof(Array).that.is.empty
        expect(calendar.getUserRights({ '_id': '@marie_ototoi' }, authorized)).to.be.instanceof(Array).that.include.members(['admin', 'view'])
        expect(calendar.getUserRights({ '_id': '@adimasci' }, authorized)).to.be.instanceof(Array).that.include.members(['view'])
    })
})
