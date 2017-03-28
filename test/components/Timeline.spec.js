import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as Timeline } from '../../views/components/Timeline'

const nestedData = [{ key: '2017-10', values: [] },
    { key: '2017-11', values: [] },
    { key: '2017-12', values: [] },
    { key: '2018-01', values: [] },
    { key: '2018-02', values: [] }]

const currentMonth = { key: '2018-01' }

describe('<Timeline />', function () {
    /*it('should render with a list of dates', function () {
        const wrapper = mount(<Timeline nestedData = { nestedData } currentMonth = { currentMonth } />)
        expect(wrapper.find('li')).to.have.exactly(5).descendants('li')
    })*/

    it('should render the given choices', function () {
        const wrapper = mount(<Timeline nestedData = { nestedData }  currentMonth = { currentMonth } />)
        expect(wrapper).to.contain.text('2017')
        expect(wrapper).to.contain.text('2018')
    })

    /* it('should be clickable when activated', function () {
        var spyFunction = sinon.spy()
        const wrapper = shallow(
            <EnumFacet
                title='test'
                choices={choices}
                addFilter={spyFunction}
                disabled={false}
            />
        )
        const button = wrapper.find('button').first()
        button.simulate('click', {target: {name: 'outward'}})
        expect(spyFunction).to.have.been.called
    }) */
})
