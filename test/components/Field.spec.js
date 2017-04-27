import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as Field } from '../../views/components/Field'

describe('<Field />', function () {
    it('should render an input with given label and value', function () {
        const wrapper = mount(
            <Field
                id = "dateStart"
                label = "Date Start"
                type = "date"
                defaultValue = "2017-04-01"
            />
        )
        expect(wrapper.find('label')).to.contain.text('Date Start')
        expect(wrapper.find('input')).to.have.value('2017-04-01')
    })

    it('should have an error class if the date is not valid', function () {
        const wrapper = mount(
            <Field
                id = "dateStart"
                label = "Date Start"
                type = "date"
                defaultValue = "203-17"
            />
        )
        expect(wrapper.find('.form-group')).to.have.className('has-error')
    })

    it('should have an error class if the url is not valid', function () {
        const wrapper = mount(
            <Field
                id = "myUrl"
                label = "Test url"
                type = "url"
                defaultValue = "http://wwwoto"
            />
        )
        expect(wrapper.find('.form-group')).to.have.className('has-error')
    })

    it('when loaded, should call function with id, type and state as arguments', function () {
        const spyFunction = sinon.spy()
        const wrapper = mount(
            <Field
                id = "dateStart"
                label = "Date Start"
                type = "date"
                defaultValue = "203-17"
                handleCheck = { spyFunction }
            />
        )
        expect(spyFunction.calledWith('dateStart', 'date', true)).to.be.true
    })

    it('when changed, should call function with id, type and state as arguments', function () {
        const spyFunction = sinon.spy()
        const wrapper = mount(
            <Field
                id = "dateStart"
                label = "Date Start"
                type = "date"
                defaultValue = "203-17"
                handleCheck = { spyFunction }
            />
        )
        expect(spyFunction.calledWith('dateStart', 'date', true)).to.be.true
        let inputStart = wrapper.find('input')
        inputStart.simulate('change', { target: { value: '2017-04-17' } })
        expect(spyFunction.calledWith('dateStart', 'date', false)).to.be.true
    })

})
