import * as d3 from 'd3'
import { default as Day }  from './Day'
import { default as Month }  from './Month'
import * as timeformat from 'd3-time-format'
import React from 'react'
import { default as Timeline } from './Timeline'

let formatDay = d3.timeFormat('%Y-%m-%d')
let formatMonthNameYear = d3.timeFormat('%B %Y')
let formatYearMonth = d3.timeFormat('%Y-%m')
let formatWeek = d3.timeFormat('%W')
let formatWeekMonthYear = d3.timeFormat('%W-%m-%Y')

class App extends React.Component {
    constructor (props) {
        super(props)
        this.getNestedData = this.getNestedData.bind(this)
        this.displayMonth = this.displayMonth.bind(this)
        this.displayDay = this.displayDay.bind(this)
        this.handleClickPrevious = this.handleClickPrevious.bind(this)
        this.handleClickNext = this.handleClickNext.bind(this)
        this.getMonthData = this.getMonthData.bind(this)
        this.state = {
            currentDay: {},
            currentMonth: [],
            dateNow: new Date(),
            dateStart: new Date(props.data[0].date),
            dateEnd: new Date(props.data[props.data.length - 1].date),
            data: props.data,
            icalData: props.icalData,
            nestedData: this.getNestedData(props.data, props.icalData),
            requestedMonth: props.requestedMonth
        }
    }

    componentDidMount () {
        if (!this.state.currentDay.date) this.displayMonth(this.state.requestedMonth, null)
    }

    render () {
        return (<div>
            <Timeline nestedData = { this.state.nestedData } currentMonth = { this.state.currentMonth } displayMonth = { this.displayMonth } />
            <main className = "calendar">
                <div className = "calendar__previous" id = "previous" onClick = { this.handleClickPrevious }>&lsaquo;</div>
                <Month currentMonth = { this.state.currentMonth } displayDay = { this.displayDay } />
                { this.state.currentDay.date ? (<Day currentDay = { this.state.currentDay } />) : (<br />) }
                <div className = "calendar__next" id = "next" onClick = { this.handleClickNext }>&rsaquo;</div>
            </main>
        </div>)
    }

    handleClickPrevious () {
        this.displayMonth(null, 'previous')
    }

    handleClickNext () {
        this.displayMonth(null, 'next')
    }

    displayMonth (whichMonth, whichDirection) {
        let requestedMonth

        if (whichMonth) {
            requestedMonth = this.monthToDate(whichMonth)
        } else if (whichDirection === 'previous' || whichDirection === 'next') {
            // new Date neccessary, otherwise React updates this.state.currentDay automatically when requestedMonth is chenged
            requestedMonth = this.state.currentMonth.date
            // check if there's a next or prev month in the data before
            if (!(formatYearMonth(requestedMonth) === formatYearMonth(new Date(this.state.data[0].date)) && whichDirection === 'previous') &&
               !(formatYearMonth(requestedMonth) === formatYearMonth(new Date(this.state.data[this.state.data.length - 1].date)) && whichDirection === 'next')) {
                let increment = (whichDirection === 'previous') ? -1 : 1
                requestedMonth.setMonth(requestedMonth.getMonth() + increment)
            }
        } else {
            requestedMonth = this.state.dateNow
        }
        // out of range
        if (!(requestedMonth >= this.state.dateStart && requestedMonth <= this.state.dateEnd)) {
            requestedMonth = this.state.dateStart
        }
        if (this.state.currentMonth.key !== formatYearMonth(requestedMonth)) {
            let currentMonth = this.getMonthData(requestedMonth, this.state.nestedData)
            currentMonth.date = requestedMonth
            this.setState({
                currentMonth
            })
            window.history.pushState({}, formatMonthNameYear(requestedMonth), '/' + formatYearMonth(requestedMonth))
        }
    }

    displayDay (whichDay) {
        if (whichDay) {
            let requestedDay = this.dayToDate(whichDay)
            if (formatDay(this.state.currentDay.date) !== whichDay) {
                let currentMonth = this.getMonthData(requestedDay, this.state.nestedData)
                let currentDay = this.getDayData(whichDay, currentMonth.values)
                this.setState({
                    currentDay
                })
            }
        }
    }

    monthToDate (month) {
        return new Date(month.substr(0, 4), (month.substr(5, 2) - 1))
    }

    dayToDate (month) {
        return new Date(month.substr(0, 4), (month.substr(5, 2) - 1), month.substr(8, 2))
    }

    getNestedData (days, icalData) {
        icalData = icalData.map(eachCal => {
            return eachCal.map(function (entry) {
                return {
                    dateStart: new Date(entry.dateStart.year, entry.dateStart.month - 1, entry.dateStart.day, entry.dateStart.hour, entry.dateStart.minute),
                    dateEnd: new Date(entry.dateEnd.year, entry.dateEnd.month - 1, entry.dateEnd.day, entry.dateEnd.hour, entry.dateEnd.minute),
                    summary: entry.summary
                }
            })
        })

        days = days.map(entry => {
            let date = new Date(entry.date)
            return {
                date,
                morning: entry.morning,
                afternoon: entry.afternoon,
                events: this.getIcalEvents(date, icalData)
            }
        })

        return d3.nest()
            .key(function (d) { return formatYearMonth(d.date) })
            .key(function (d) { return formatWeekMonthYear(d.date) })
            .entries(days)
    }
    getMonthData (requestedDate, nestedData) {
        return nestedData.filter(element => {
            return element.key === formatYearMonth(requestedDate)
        })[0]
    }
    getDayData (requestedDate, monthNestedData) {
        let findDay
        monthNestedData.forEach(week => {
            week.values.forEach(element => {
                if (formatDay(element.date) === (requestedDate)) {
                    findDay = element
                }
            })
        })
        return findDay
    }
    getIcalEvents (day, icalData) {
        return icalData.reduce((accumulator, currentValue) => {
            return accumulator.concat(currentValue.filter(function (dayElement) {
                // console.log(formatDay(dayElement.dateStart) === formatDay(day), formatDay(dayElement.dateStart) , formatDay(day))
                return formatDay(dayElement.dateStart) === formatDay(day)
            }))
        }, []).sort((a, b) => {
            return a.dateStart > b.dateStart
        })
    }
}

export default App
