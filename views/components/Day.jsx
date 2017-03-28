import * as d3 from 'd3'
import { default as Events }  from './Events'
import { default as Hour }  from './Hour'
import React, { Component } from 'react'
import * as timeformat from 'd3-time-format'

let formatMonthNameYear = d3.timeFormat('%B %Y')
let formatYearMonth = d3.timeFormat('%Y-%m')
let formatDayHuman = d3.timeFormat('%A %e %B %Y')
let formatHour = d3.timeFormat('%H')
let formatMinutes = d3.timeFormat('%M')

class Day extends Component {
    constructor (props) {
        super(props)
        this.state = {
            listHours: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 13, 14, 18, 19, 20, 21, 22, 23]
        }
    }
    render () {
        let eventsMorning = []
        let eventsLunch = []
        let eventsAfternoon = []
        let eventsEvening = []
        this.props.currentDay.events.forEach(event => {
            // this is a very unclean way of handling time
            let hourStart = Number(formatHour(event.dateStart) + '.' + formatMinutes(event.dateStart))
            if (hourStart < 12) {
                eventsMorning.push(event)
            } else if (hourStart < 13.30) {
                eventsLunch.push(event)
            } else if (hourStart < 18) {
                eventsAfternoon.push(event)
            } else {
                eventsEvening.push(event)
            }
        })
        return (<section className = "calendar__detail">
            <h1 className = "calendar__title">{ formatDayHuman(this.props.currentDay.date) }</h1>
            <div className = "calendar__detail__wrapper">
                <div className = "calendar__detail__events">
                    <Events classEvents = 'calendar__detail__morning' events = { eventsMorning } />
                    <Events classEvents = 'calendar__detail__lunch' events = { eventsLunch } />
                    <Events classEvents = 'calendar__detail__afternoon' events = { eventsAfternoon } />
                    <Events classEvents = 'calendar__detail__evening' events = { eventsEvening } />
                </div>
                <ul className = "calendar__detail__hours">{ this.state.listHours.map(hour => {
                    return <Hour hour = { hour } key = { hour.toString() } currentDay = { this.props.currentDay } morning = { this.props.currentDay.morning } afternoon = { this.props.currentDay.afternoon } key = { hour.toString() } />
                })}</ul>
            </div>
        </section>)
    }
}

export default Day
