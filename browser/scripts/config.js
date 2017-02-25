const d3 = require('d3'),
	template = require('../../views/editCalendar')


d3.selectAll('.add_cal').on('click', function() {

    let newIndex = d3.selectAll('.row-cal').size()

    let newNode =  document.createElement('div')
    newNode.innerHTML = template({ id : 'cal_'+ newIndex, calendar : ''})
   	this.parentNode.parentNode.appendChild(newNode)

    d3.event.preventDefault()

}, false)


module.exports = this