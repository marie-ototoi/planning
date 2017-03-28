import * as d3 from 'd3'
import * as timeformat from 'd3-time-format'

let formatDay = d3.timeFormat('%Y-%m-%d')
let formatDayHuman = d3.timeFormat('%A %e %B %Y')
let formatDayMonth = d3.timeFormat('%e')
let formatShortMonthName = d3.timeFormat('%b')
let formatYearMonth = d3.timeFormat('%Y-%m')
let formatTime = d3.timeFormat('%H:%M')

let d3Month = {}

d3Month.create = function (el, state) {
    this.update(el, state)
}

d3Month.update = function (el, state) {
    // Re-compute
    // render
    if (state.currentMonth.values) this._drawMonth(el, state)
    // d3.select(el).selectAll('li.timeline__item:not(.ym' + requestFormatted + ')').classed('active', false)
    // d3.select(el).selectAll('li.timeline__item.ym' + requestFormatted + '').classed('active', true)
}

d3Month.destroy = function (el) {
    // clean-up
}

d3Month._drawMonth = function (el, state) {
    // ENTER
    let calendarRow = d3.select(el).selectAll('.calendar__row')
        .data(state.currentMonth.values, function (d) { return d.key })

    let calendarRowEnter = calendarRow.enter()
            .append('div')
            .attr('class', function (d, i) { return (i === 0) ? 'calendar__row calendar__row-' + d.key + ' calendar__row_first' : 'calendar__row calendar__row-' + d.key })

    let calendarDay = calendarRowEnter
        .selectAll('.calendar__day')
        .data(function (d) { return d.values })

    let calendarDayEnter = calendarDay.enter()
        .append('div')
        .attr('class', function (d) {
            let classDay = d.morning
            if (d.afternoon !== d.morning) classDay += '_' + d.afternoon
            return 'calendar__day ' + classDay
        })

    calendarDayEnter
        .append('div')
        .attr('class', d => {
            return (formatDay(d.date) === formatDay(new Date())) ? 'calendar__daynumber calendar__day_today ' : 'calendar__daynumber'
        })
        .text(function (d) {
            // if(getIcalEvents(d.date).length>0) console.log(getIcalEvents(d.date)) ;
            return formatDayMonth(d.date)
        })

    calendarDayEnter
        .append('div')
        .html(function (d) {
            let event = '<ul class="calendar__day__events">'
            d.events.forEach((element, index) => {
                if (index < 2) event += '<li class="calendar__day__event">' + formatTime(element.dateStart) + ' ' + element.summary + '</li>'
            })
            event += '</ul>'
            return event
        })

    // ENTER & UPDATE
    d3.select(el).selectAll('.calendar__day')
        .on('click', function (d, i) {
            state.requestDay(formatDay(d.date))
        })

    // EXIT
    calendarRow.exit()
        .remove()
    calendarDay.exit()
        .remove()
}

export default d3Month
