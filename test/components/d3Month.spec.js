import * as d3 from 'd3'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as d3Month } from '../../views/components/d3Month'

const today = new Date()
today.setMinutes(0)
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
                {
                    date: today,
                    events: [
                        { dateStart: today.setHours(12), dateEnd: today.setHours(13), summary: 'Déjeûner avec XYZ' },
                        { dateStart: today.setHours(16), dateEnd: today.setHours(17), summary: 'Rendez-vous très important' }
                    ],
                    morning: 'IL',
                    afternoon: 'IL'
                }
            ]
        }
    ]
}

describe('d3Month', function () {
    before(function () {
        document.body.innerHTML = '<div className = "calendar__rows" id = "calendar__rows"></div>'
        let timelineElement = document.getElementById('calendar__rows')
        d3Month.create(timelineElement, { currentMonth })
    })
    after(function () {
        document.body.innerHTML = ''
    })
    it('should render a row per week', function () {
        expect(d3.selectAll('.calendar__row').size()).to.equal(3)
    })
    it('should render a cell per day', function () {
        expect(d3.selectAll('.calendar__row-21-06-2018 .calendar__day').size()).to.equal(3)
        expect(d3.selectAll('.calendar__row-22-06-2018 .calendar__day').size()).to.equal(7)
    })
    it('should highlight current day', function () {
        expect(Number(d3.select('.calendar__day_today').node().innerHTML.trim())).to.equal(today.getDate())
    })
    it('should display events', function () {
        expect(d3.selectAll('.calendar__day__event').size()).to.equal(2)
    })
})
