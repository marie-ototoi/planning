const calendar = require('./scripts/calendar'),
	config = require('./scripts/config')


const App = {
  	init(data, icalData, requestedDate) {
    	calendar(data, icalData, requestedDate)
  	}


}

module.exports = App