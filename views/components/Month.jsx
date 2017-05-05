import * as d3 from 'd3'
import d3Month from './d3Month'
import React, { Component } from 'react'
import * as timeformat from 'd3-time-format'

let formatMonthNameYear = d3.timeFormat('%B %Y')
let formatYearMonth = d3.timeFormat('%Y-%m')

class Month extends Component {
    componentDidMount () {
        // console.log('component did mount', this.props)

        d3Month.create(this.refs.month, this.props)
    }
    componentDidUpdate () {
        console.log('on logge update', this.props.currentMonth)
        // console.log('ben là on update', this.props)
        d3Month.update(this.refs.month, this.props)
    }
    componentWillUnmount () {
        d3Month.destroy(this.refs.month)
    }
    render () {
        return (<section className = "monthDetail ym2017-03" id = { 'ym' + this.props.currentMonth.key }>
            <h1 className = "calendar__title">{ formatMonthNameYear(this.props.currentMonth.date) }</h1>
            <div className = "calendar__rows" ref = "month"></div>
        </section>)
    }
}

export default Month
