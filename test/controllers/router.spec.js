const chai = require('chai')
const expect = chai.expect

const getUserRights = require('../../controllers/getUserRights')

describe('Router - ', function () {
    let authorized = {}
    before(function () {
        // environment vars
        authorized.autorizedUsers = ['@epietriga', '@adimasci', '@nchauvat', '@OCayrol', '@Marla_da_Silva', '@JulietteTaka', '@mariepassage']
        authorized.adminUsers = ['@marie_ototoi']
    })
    it('should return a list of rights for the user', function () {
        expect(getUserRights('', authorized)).to.be.instanceof(Array).that.is.empty
        expect(getUserRights('@marie_ototoi', authorized)).to.be.instanceof(Array).that.include.members(['admin', 'view'])
        expect(getUserRights('@adimasci', authorized)).to.be.instanceof(Array).that.include.members(['view'])
    })
})
