import * as d3 from 'd3'
import React from 'react'
import { shallow, mount, render } from 'enzyme'
import chai, {expect} from 'chai'
import chaiEnzyme from 'chai-enzyme'
chai.use(chaiEnzyme())
import sinon from 'sinon'
import sinonChai from 'sinon-chai'
chai.use(sinonChai)
import { default as d3Timeline } from '../../views/components/d3Timeline'

const nestedData = [
    { key: '2017-10', values: [] },
    { key: '2017-11', values: [] },
    { key: '2017-12', values: [] },
    { key: '2018-01', values: [] },
    { key: '2018-02', values: [] }
]

const currentMonth = { key: '2018-01' }

describe('d3Timeline', function () {
    before(function () {
        document.body.innerHTML = '<ul class="timeline__list" id="timeline__list"></ul>'
        let timelineElement = document.getElementById('timeline__list')
        d3Timeline.create(timelineElement, { nestedData, currentMonth })
    })
    after(function () {
        document.body.innerHTML = ''
    })

    it('should render with a list of dates', function () {
        expect(d3.selectAll('.timeline__item').size()).to.equal(5)
    })
})
