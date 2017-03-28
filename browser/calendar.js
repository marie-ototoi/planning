import App from '../components/App'
import React from 'react'
import {render} from 'react-dom'

const Calendar = {
    init (data, icalData, requestedMonth) {
        // calendar(data, icalData, requestedDate)
        render(<App data = { data } icalData = { icalData } requestedMonth = { requestedMonth } />, document.getElementById('app'))
    }
}

module.exports = Calendar
