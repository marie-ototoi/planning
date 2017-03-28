import * as d3 from 'd3'
import React, { Component } from 'react'

class Hour extends Component {
    render () {
        let classSlice = 'calendar__detail__hour h_' + this.props.hour
        if (this.props.hour >= 9 && this.props.hour < 13) classSlice += ' ' + this.props.morning
        if (this.props.hour >= 14 && this.props.hour < 18) classSlice += ' ' + this.props.afternoon
        return (<li className = { classSlice }>&nbsp;</li>)
    }
}

export default Hour
