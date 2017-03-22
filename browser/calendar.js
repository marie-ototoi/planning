import App from '../components/App'
import React from 'react'
import {render} from 'react-dom'

const Calendar = {
    init (data, icalData, requestedDate) {
        // calendar(data, icalData, requestedDate)
        render(<App data = { data } icalData = { icalData } requestedDate = { requestedDate } />, document.getElementById('app'))
    }
}

module.exports = Calendar
