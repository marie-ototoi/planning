import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as Month } from '../../views/components/Month'

const currentMonth = {
    key: '2018-06',
    values: [
        {
            key: '21-06-2018',
            values: [
                { date: new Date('Fri Jun 01 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Sat Jun 02 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Sun Jun 03 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' }
            ]
        },
        {
            key: '22-06-2018',
            values: [
                { date: new Date('Mon Jun 04 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Tue Jun 05 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Wed Jun 06 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Thu Jun 07 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Fri Jun 08 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Sat Jun 09 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Sun Jun 10 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' }
            ]
        },
        {
            key: '23-06-2018',
            values: [
                { date: new Date('Mon Jun 11 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Tue Jun 12 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Wed Jun 13 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Thu Jun 14 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Fri Jun 15 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Sat Jun 16 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' },
                { date: new Date('Sun Jun 17 2018 02:00:00 GMT+0200 (CEST)'), events: [], morning: 'IL', afternoon: 'IL' }
            ]
        }
    ]
}

describe('<Month />', function () {
    it('should render the given list of days', function () {
        const spyFunction = sinon.spy()
        const wrapper = mount(<Month currentMonth = { currentMonth } displayDay = { spyFunction } />)
        expect(wrapper).to.contain.text('2')
        expect(wrapper).to.contain.text('17')
    })
})
