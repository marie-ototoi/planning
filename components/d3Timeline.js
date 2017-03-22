const d3 = require('d3')
const timeformat = require('d3-time-format')

let d3Timeline = {}
const formatShortMonthName = d3.timeFormat('%b')
const formatYearMonth = d3.timeFormat('%Y-%m')

d3Timeline.create = function (el, state) {
    this.update(el, state)
}

d3Timeline.update = function (el, state) {
    // Re-compute
    // render
    this._drawNav(el, state)
    let requestFormatted = formatYearMonth(state.currentDate)
    d3.select(el).selectAll('li.timeline__item:not(.ym' + requestFormatted + ')').classed('active', false)
    d3.select(el).selectAll('li.timeline__item.ym' + requestFormatted + '').classed('active', true)
}

d3Timeline.destroy = function (el) {
    // clean-up
}

d3Timeline._drawNav = function (el, state) {
    let listItem = d3.select(el).selectAll('.timeline__item')
        .data(state.nestedData, function (d) { return d.id })

    // ENTER
    let listItemEnter = listItem
        .enter()
        .append('li')
        .attr('class', function (d) { return 'timeline__item ym' + d.key })

    listItemEnter
        .append('span')
        .attr('class', function (d, i) { return (i === 0 || d.key.substr(5, 2) === '01') ? 'timeline__year' : 'timeline__year hidden' })
        .text(function (d) { return d.key.substr(0, 4) })
    listItemEnter
        .append('span')
        .attr('class', 'timeline__month')
        .text(function (d) { return formatShortMonthName(new Date(d.key)) })
    listItemEnter
        .on('click', function (d, i) {
            let saveTheDate = d.values[0].values[0].date
            state.requestDate(saveTheDate, null)
        })

    // ENTER & UPDATE
    listItem
        .on('click', function (d, i) {
            let saveTheDate = d.values[0].values[0].date
            state.requestDate(saveTheDate, null)
        })

    // EXIT
    listItem.exit()
        .remove()
}

export default d3Timeline
