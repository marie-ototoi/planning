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
    it('should render the given list of month/year', function () {
        const wrapper = mount(<Timeline nestedData = { nestedData } currentMonth = { currentMonth } />)
        expect(wrapper).to.contain.text('2017')
        expect(wrapper).to.contain.text('2018')
    })
})
