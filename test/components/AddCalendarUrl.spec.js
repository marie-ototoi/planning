import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as AddCalendarUrl } from '../../views/components/AddCalendarUrl'

const calendarUrls = [{ id: 'cal_0', calendarUrl: '' },
    { id: 'cal_1', calendarUrl: 'http://www.test.fr' },
    { id: 'cal_2', calendarUrl: 'http://www.autretest.fr' }]

describe('<AddCalendarUrl />', function () {
    it('should render an input with given id', function () {
        const wrapper1 = mount(
            <AddCalendarUrl
                id = { calendarUrls[0].id }
                calendarUrl = { calendarUrls[0].calendarUrl }
            />
        )
        const wrapper2 = mount(
            <AddCalendarUrl
                id = { calendarUrls[1].id }
                calendarUrl = { calendarUrls[1].calendarUrl }
            />
        )
        expect(wrapper1.find('input')).to.have.attr('id').equal('cal_0')
        expect(wrapper1.find('label')).to.have.attr('for').equal('cal_0')
        expect(wrapper2.find('input')).to.have.attr('id').equal('cal_1')
        expect(wrapper2.find('label')).to.have.attr('for').equal('cal_1')
    })

    it('should render an input with given value', function () {
        const wrapper1 = mount(
            <AddCalendarUrl
                id = { calendarUrls[0].id }
                calendarUrl = { calendarUrls[0].calendarUrl }
            />
        )
        const wrapper2 = mount(
            <AddCalendarUrl
                id = { calendarUrls[1].id }
                calendarUrl = { calendarUrls[1].calendarUrl }
            />
        )
        const wrapper3 = mount(
            <AddCalendarUrl
                id = { calendarUrls[2].id }
                calendarUrl = { calendarUrls[2].calendarUrl }
            />
        )
        expect(wrapper1.find('input')).to.have.value('')
        expect(wrapper2.find('input')).to.have.value('http://www.test.fr')
        expect(wrapper3.find('input')).to.have.value('http://www.autretest.fr')
    })

    it('when value changes, should call a function with element type, value and id as argument', function () {
        var spyFunction = sinon.spy()
        const wrapper = shallow(
            <AddCalendarUrl
                id = { calendarUrls[0].id }
                calendarUrl = { calendarUrls[0].calendarUrl }
                handleChange = { spyFunction }
            />
        )
        let input = wrapper.find('input').first()
        input.simulate('change', { target: { value: calendarUrls[1].calendarUrl } })
        expect(spyFunction.calledWith('url', calendarUrls[1].calendarUrl, calendarUrls[0].id)).to.be.true
    })

})
