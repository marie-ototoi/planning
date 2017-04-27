import React from 'react'
import classNames from 'classnames'
import { default as Field } from './Field'

class Config extends React.Component {
    constructor (props) {
        super(props)
        this.handleCheck = this.handleCheck.bind(this)
        this.handleAddCalendar = this.handleAddCalendar.bind(this)
        this.errors = {
            url: 'The url is not valid.',
            date: 'The date is not valid.'
        }
        this.state = {
            errorLabels: props.errorLabels ? props.errorLabels : this.errors,
            dateStart: props.dateStart,
            dateEnd: props.dateEnd,
            calendarUrls: props.calendarUrls,
            errors: {}
        }
    }

    render () {
        let addCalendar = null
        if (this.state.calendarUrls.length > 0) {
            addCalendar = this.state.calendarUrls.map((calendarUrl, index) => {
                return (<Field
                    type = "url"
                    defaultValue = { calendarUrl }
                    label = "Calendar url"
                    name = "calendars[]"
                    id = { 'cal_' + index }
                    key = { 'cal_' + index }
                    handleCheck = { this.handleCheck }
                />)
            })
        } else {
            addCalendar = (<Field
                type = "url"
                defaultValue = ""
                label = "Calendar url"
                name = "calendars[]"
                id = "cal_0"
                key = "cal_0"
                handleCheck = { this.handleCheck }
            />)
        }
        let errorMessages = new Set()
        for (let element in this.state.errors) {
            if (this.state.errors[element].error === true) errorMessages.add(this.state.errors[element].type)
        }
        errorMessages = Array.from(errorMessages).map(error => {
            return this.state.errorLabels[error]
        })
        errorMessages = (<div className = "error-messages text-danger">{ errorMessages.join(' ') }</div>)
        return (<form action = "/config" method = "POST">
            <div>
                <Field
                    type = "date"
                    defaultValue = { this.state.dateStart }
                    label = "Starting date"
                    name = "dateStart"
                    id = "dateStart"
                    handleCheck = { this.handleCheck }
                />
                <Field
                    type = "date"
                    defaultValue = { this.state.dateEnd }
                    label = "Endind date "
                    name = "dateEnd"
                    id = "dateEnd"
                    handleCheck = { this.handleCheck }
                />
                { addCalendar }
                <a className = "button add_cal" href = "#" onClick = { this.handleAddCalendar }>Add a calendar stream</a>
                { errorMessages }
            </div>
            <input
                type = "submit"
                value = "Save config"
                className = "btn btn-large"
            />
        </form>)
    }

    handleAddCalendar () {
        // add calendar
        let calendarUrls = this.state.calendarUrls
        calendarUrls.push('')
        this.setState({ calendarUrls })
    }

    handleCheck (id, type, error) {
        // update states
        let errors = this.state.errors
        errors[id] = { type, error }
        this.setState({ errors })
    }
}

export default Config
