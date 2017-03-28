import * as d3 from 'd3'
import { default as Event }  from './Event'
import React, { Component } from 'react'

class Events extends Component {
    render () {
        return (this.props.events.length > 0) ? (<ul className = { this.props.classEvents }>
            { this.props.events.map(event => {
                return <Event event = { event } key = { event.dateStart.toString() } />
            })
        }
        </ul>) : (<div className = { this.props.classEvents }></div>)
    }
}

export default Events
