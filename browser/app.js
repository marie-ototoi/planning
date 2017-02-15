const calendar = require('./scripts/calendar')


const App = {
  	init(data, icalData, requestedDate) {
    	calendar(data, icalData, requestedDate)
  	}
}

module.exports = App