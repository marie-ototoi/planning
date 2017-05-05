import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as Config } from '../../views/components/Config'

const calendarUrls = [
    'http://www.test.fr',
    'http://www.autre_test.fr',
    'http://www.autre-autre-test.com'
]
const dateStart = '2017-04-01'
const dateEnd = '2020-03-31'

describe('<Config />', function () {
    it('should render a dateStart input with given value', function () {
        const wrapper = mount(
            <Config dateStart = { dateStart } dateEnd = { dateEnd } calendarUrls = { calendarUrls } />
        )
        expect(wrapper.find('input#dateStart')).to.have.value('2017-04-01')
    })

    it('should render a dateEnd input with given value', function () {
        const wrapper = mount(
            <Config
                dateStart = { dateStart }
                dateEnd = { dateEnd }
                calendarUrls = { calendarUrls }
            />
        )
        expect(wrapper.find('input#dateEnd')).to.have.value('2020-03-31')
    })

    it('should render as many <AddCalendarUrl /> components as given urls', function () {
        const wrapper = mount(
            <Config
                dateStart = { dateStart }
                dateEnd = { dateEnd }
                calendarUrls = { calendarUrls }
            />
        )
        expect(wrapper.find('input[type="url"]')).to.have.length(3)
    })

    it('should have exactly one <AddCalendarUrl /> component if no urls are given', function () {
        const wrapper = mount(
            <Config
                dateStart = { dateStart }
                dateEnd = { dateEnd }
                calendarUrls = { [] }
            />
        )
        expect(wrapper.find('input[type="url"]')).to.have.length(1)
    })

    it('should display an error message if the date is not valid', function () {
        const wrapper = mount(
            <Config
                dateStart = "2037-03"
                dateEnd = "203-09-03"
                calendarUrls = { [] }
                errorLabels = { {
                    url: 'The url is not valid',
                    date: 'The date is not valid'
                } }
            />
        )
        expect(wrapper.find('div.error-messages')).to.contain.text('The date is not valid')
    })

    it('should display an error message if a url is not valid', function () {
        const wrapper = mount(
            <Config
                dateStart = "2037-03"
                dateEnd = "203-09-03"
                calendarUrls = { ['http://wwwtoto', 'http://www.ototoi.fr'] }
                errorLabels = { {
                    url: 'The url is not valid',
                    date: 'The date is not valid'
                } }
            />
        )
        expect(wrapper.find('div.error-messages')).to.contain.text('The url is not valid')
    })
})
