import Config from './components/Config'
import React from 'react'
import { render } from 'react-dom'

const App = {
    init (dateStart, dateEnd, calendarUrls) {
        render(<Config dateStart = { dateStart } dateEnd = { dateEnd } calendarUrls = { calendarUrls } />, document.getElementById('app'))
    }
}

module.exports = App
