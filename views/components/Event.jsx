import * as d3 from 'd3'
import React, { Component } from 'react'
import * as timeformat from 'd3-time-format'

let formatDay = d3.timeFormat('%Y-%m-%d')
let formatDayTime = d3.timeFormat('%Y-%m-%d %H:%M')
let formatTime = d3.timeFormat('%H:%M')

class Event extends Component {
    render () {
        let dateEnd = (formatDay(this.props.event.dateStart) === formatDay(this.props.event.dateEnd)) ? formatTime(this.props.event.dateEnd) : formatDayTime(this.props.event.dateEnd)
        let timeStart = formatTime(this.props.event.dateStart)
        return (<li className = "calendar__detail__event">{ timeStart + ' - ' + dateEnd + ' : ' + this.props.event.summary }</li>)
    }
}

export default Event
