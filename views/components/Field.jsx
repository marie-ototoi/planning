import React from 'react'
import classNames from 'classnames'

class Field extends React.Component {
    constructor (props) {
        super(props)
        this.handleCheck = props.handleCheck
        this.checkField = this.checkField.bind(this)
        this.defaults = { date: 'dd/mm/YYYY', url: 'http://monstream.fr' }
        this.state = {
            value: props.defaultValue ? props.defaultValue : '',
            error: false,
            default: this.defaults[props.type]
        }
    }

    componentDidMount () {
        this.checkField(this.state.value)
    }

    render () {
        return (<div className = { classNames('form-group', 'row', 'row-cal', { 'has-error': this.state.error }) }>
            <label htmlFor = { this.props.id } className = "col-sm-2 col-sm-offset-3 col-form-label">{ this.props.label }</label>
            <div className = "col-sm-4">
                <input
                    onChange = { (e) => this.checkField(e.target.value) }
                    type = { this.props.type }
                    name = { this.props.name }
                    value = { this.state.value }
                    placeholder = { this.state.default }
                    id = { this.props.id }
                    className = "form-control"
                />
            </div>
        </div>)
    }

    checkField (value) {
        let regex
        if (this.props.type === 'date') {
            regex = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/
        } else if (this.props.type === 'url') {
            regex = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/
        }
        let error = value !== '' && !regex.test(value)
        this.setState({ error, value })
        if (this.handleCheck) this.handleCheck(this.props.id, this.props.type, error)
    }
}

export default Field
