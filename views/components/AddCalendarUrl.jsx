import React from 'react'

class AddCalendarUrl extends React.Component {
    constructor (props) {
        super(props)
        this.handleChange = props.handleChange
    }

    render () {
        let addCalendar = null
        if (this.props.id === 'cal_0') {
            addCalendar = <a className = "button add_cal" href = "#" onClick = { this.props.handleClick }>Add a stream</a>
        } else {
            addCalendar = ''
        }
        return (<div className = "form-group row row-cal">
            <label htmlFor = { this.props.id } className = "col-sm-2 col-sm-offset-3 col-form-label">Ical stream</label>
            <div className = "col-sm-4">
                <input
                    onChange = { (e) => this.handleChange('url', e.target.value, this.props.id) }
                    type = "url"
                    name = "calendars[]"
                    value = { this.props.calendarUrl }
                    id = { this.props.id }
                    className = "form-control add-calendar"
                />
            </div>
            { addCalendar }
        </div>)
    }
}

export default AddCalendarUrl
