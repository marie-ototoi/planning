const calendar = require('./scripts/calendar')


const App = {
  	init(data, requestedDate) {
    	calendar(data, requestedDate)
  	}
}

module.exports = App