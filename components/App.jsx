const d3 = require('d3')
const React = require('react')
const timeformat = require('d3-time-format')
const Timeline = require('./Timeline').default

const formatDay = d3.timeFormat('%Y-%m-%d')
const formatMonthNameYear = d3.timeFormat('%B %Y')
const formatYearMonth = d3.timeFormat('%Y-%m')
const formatWeek = d3.timeFormat('%W')

class App extends React.Component {
    constructor (props) {
        super(props)
        this.getNestedData = this.getNestedData.bind(this)
        this.requestDate = this.requestDate.bind(this)
        let requestedDate = null
        if (props.requestedDate && props.requestedDate.length === 7) {
            let year = Number(props.requestedDate.substr(0, 4))
            let month = Number(props.requestedDate.substr(5, 2)) - 1
            requestedDate = new Date(year, month)
        }
        this.state = {
            currentDate: null,
            dateNow: new Date(),
            dateStart: new Date(props.data[0].date),
            dateEnd: new Date(props.data[props.data.length - 1].date),
            data: props.data,
            icalData: props.icalData,
            nestedData: this.getNestedData(props.data, props.icalData),
            requestedDate: requestedDate,
            requestDate: this.requestDate
        }
    }

    componentDidMount () {
        if (this.state.currentDate === null) this.requestDate(this.state.requestedDate, null)
        // console.log('component will mount', this.state.nestedData)
    }

    render () {
        // console.log('rerender app', this.state)
        return (<Timeline nestedData = { this.state.nestedData } currentDate = { this.state.currentDate } requestDate = { this.state.requestDate } />)
    }

    requestDate (whichDate, whichDirection) {
        let requestedDate

        if (whichDate) {
            requestedDate = whichDate
        } else if (whichDirection === 'previous' || whichDirection === 'next') {
            requestedDate = this.state.currentDate
            // check if there's a next or prev month in the data before
            if (!(formatYearMonth(this.state.currentDate) === formatYearMonth(new Date(this.state.data[0].date)) && (whichDirection === 'previous')) &&
               !(formatYearMonth(this.state.currentDate) === formatYearMonth(new Date(this.state.data[this.state.data.length - 1].date)) && (whichDirection === 'next'))) {
                let increment = (whichDirection === 'previous') ? -1 : 1
                requestedDate.setMonth(requestedDate.getMonth() + increment)
            }
        } else {
            requestedDate = this.state.dateNow
        }
        if (!(requestedDate >= this.state.dateStart && requestedDate <= this.state.dateEnd)) requestedDate = this.state.dateStart
        if (this.state.currentDate !== requestedDate) {
            this.setState({ currentDate: requestedDate })
            window.history.pushState({}, formatMonthNameYear(requestedDate), '/' + formatYearMonth(requestedDate))
        }
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
            let events = this.getIcalEvents(date, icalData)
            return {
                date,
                morning: entry.morning,
                afternoon: entry.afternoon,
                events
            }
        })

        return d3.nest()
            .key(function (d) { return formatYearMonth(d.date) })
            .key(function (d) { return formatWeek(d.date) })
            .entries(days)
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
