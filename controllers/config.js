const util = require('util'),
	express = require('express'), 
	router = express.Router(),
	Day = require('../models/day')
	//,

router.get('/', function getConfig(req, res){

	Promise.all([
	    Day.getFirstDay(),
	    Day.getLastDay()
	])
	.then(([dateStart, dateEnd]) => {
	    res.render('config.pug', {title : 'Planning CIFRE - Configuration', dateStart: dateStart[0]._id, dateEnd: dateEnd[0]._id})
	    res.end()
	})
	.catch((err) => {
	    res.render('config.pug', {title : 'Planning CIFRE - Configuration'})
	})
	
})


router.post('/', function setConfig (req, res) {
	console.log('query', req.query,'body', req.body,'params', req.headers)
	req.checkBody('dateStart', 'Invalid starting date').notEmpty().isDate()
	req.checkBody('dateEnd', 'Invalid ending date').notEmpty().isDate()
	req.getValidationResult().then(function(result) {
	    if (!result.isEmpty()) {
	    	req.flash('error', 'There have been validation errors: ' + util.inspect(result.array()));
	      	
	    }
	    else{
	    	Day.configCalendar(req.body.dateStart, req.body.dateEnd)
	    	 req.flash('success', 'Merci')
	    }
	    res.redirect('/config')
  })
  	
})

router.post('/day/:id', function setDay (req, res) {
  	
})

module.exports = router