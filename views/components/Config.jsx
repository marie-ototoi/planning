import React from 'react'
import classNames from 'classnames'
import { default as AddCalendarUrl } from './AddCalendarUrl'

class Config extends React.Component {
    constructor (props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleAddCalendar = this.handleAddCalendar.bind(this)
        this.errors = {
            url: 'The url is not valid',
            date: 'The date is not valid'
        }
        this.state = {
            errorLabels: props.errorLabels ? props.errorLabels : this.errors,
            dateStart: props.dateStart,
            dateEnd: props.dateEnd,
            calendarUrls: props.calendarUrls,
            errors: new Set()
        }
    }

    componentDidMount () {
        this.handleChange('date', this.state.dateStart, 'dateStart')
        this.handleChange('date', this.state.dateEnd, 'dateEnd')
    }

    render () {
        let addCalendar = null
        if (this.state.calendarUrls.length > 0) {
            addCalendar = this.state.calendarUrls.map((calendarUrl, index) => {
                return (<AddCalendarUrl
                    calendarUrl = { calendarUrl }
                    id = { 'cal_' + index }
                    key = { 'cal_' + index }
                    handleChange = { this.handleChange }
                    handleClick = { this.handleAddCalendar }
                />)
            })
        } else {
            addCalendar = (<AddCalendarUrl
                calendarUrl = ""
                id = "cal_0"
                key = "cal_0"
                handleChange = { this.handleChange }
                handleClick = { this.handleAddCalendar }
            />)
        }
        let listErrors = []
        let errorMessages
        if (this.state.errors.size > 0) {
            this.state.errors.forEach(message => {
                listErrors.push(this.state.errorLabels[message.type])
            })
            errorMessages = (<div className = "error-messages">{ listErrors.join('<br />') }</div>)
        }
        let errorStart = false
        let errorEnd = false
        this.state.errors.forEach(error => {
            if (error.id === 'dateStart') errorStart = true
            if (error.id === 'dateStart') errorEnd = true
        })
        return (<form action = "/config" method = "POST">
            <div>
                <div className = "form-group row">
                    <label
                        htmlFor = "dateStart"
                        className = "col-sm-2 col-sm-offset-3 col-form-label">Date start
                    </label>
                    <div className = "col-sm-4">
                        <input
                            type = "date"
                            name = "dateStart"
                            defaultValue = { this.state.dateStart }
                            id = "dateStart"
                            className = { classNames('form-control', { 'error': errorStart }) }
                            onChange = { (e) => this.handleChange('date', e.target.value, 'dateStart') }
                        />
                    </div>
                </div>
                <div className = "form-group row">
                    <label
                        htmlFor = "dateEnd"
                        className = "col-sm-2 col-sm-offset-3 col-form-label">Date end
                    </label>
                    <div className = "col-sm-4">
                        <input
                            type = "date"
                            name = "dateEnd"
                            defaultValue = { this.state.dateEnd }
                            id = "dateEnd"
                            className = { classNames('form-control', { 'error': errorEnd }) }
                            onChange = { (e) => this.handleChange('date', e.target.value, 'dateEnd') }
                        />
                    </div>
                </div>
            </div>
            { addCalendar }
            { errorMessages }
            <input
                type = "submit"
                value = "Save config"
                className = "btn btn-large"
            />
        </form>)
    }

    handleAddCalendar () {
        // add calendar

    }

    handleChange (type, value, id) {
        let errors = this.state.errors
        if (type === 'url') {
            let regex = /^http:\/\/[\w]+.[a-z]+$/
            if (!regex.test(value)) {
                errors.add({ type, id })
                this.setState({ errors })
            }
        } else if (type === 'date') {
            let regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
            if (!regex.test(value)) {
                errors.add({ type, id })
                this.setState({ errors })
            }
        }
    }
}

export default Config
