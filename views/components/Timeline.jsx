import d3 from 'd3'
import React, { Component } from 'react'
import d3Timeline from './d3Timeline'

class Timeline extends Component {
    componentDidMount () {
        d3Timeline.create(this.refs.timeline, this.props)
    }
    componentDidUpdate () {
        d3Timeline.update(this.refs.timeline, this.props)
    }
    componentWillUnmount () {
        d3Timeline.destroy(this.refs.timeline)
    }
    render () {
        return (<nav className="timeline"><ul className="timeline__list" ref="timeline"></ul></nav>)
    }
}

export default Timeline
