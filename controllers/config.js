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
	//console.log('query', req.query,'body', req.body,'params', req.headers)
	req.checkBody('dateStart', 'Invalid starting date').notEmpty().isDate()
	req.checkBody('dateEnd', 'Invalid ending date').notEmpty().isDate()
	req.getValidationResult()
	.then((result) =>{
	    if (!result.isEmpty()) {
	    	req.flash('error', 'There have been validation errors: ' + util.inspect(result.array()));
	      	res.redirect('/config')
	    }
	    else{
	    	Day.configCalendar(req.body.dateStart, req.body.dateEnd)
	    	.then((results) => {
	    		req.flash('success', 'The calendar has been updated, thank you')
	    		res.redirect('/config')
	    	})
	    	.catch((err) => {
	    		req.flash('error', 'Sorry, an error has occured while attempting to update the calendar ' + err)
			})
	    }
  	})  	
})

router.get('/day/:id', function getConfig(req, res){
	Day.getDay(req.params.id)
	.then(day =>{
		if (day){
			res.render('configDay.pug', {title : 'Planning CIFRE - Configuration', day, types : [
				{'key': 'IL', 'val' : 'ILDA'}, 
				{'key': 'LO', 'val' : 'LOGILAB'},
				{'key': 'CO', 'val' : 'Conference'},
				{'key': 'SC', 'val' : 'University'},
				{'key': 'HO', 'val' : 'Holidays'}
			] })
			res.end
		} else{
			req.flash('error', 'Sorry, the day ' + req.params.id + ' is not part of the timespan')
			res.redirect('/config')
		}
	})
	.catch( err =>{
		req.flash('error', 'Sorry, an error has occured while attempting to edit a specific day ' + err)
		res.redirect('/config')
	})
})


router.post('/day/:id', function setDay (req, res) {
  	req.checkBody('day', 'Invalid date').notEmpty().isDate()
	req.checkBody('morning', 'Invalid morning location').len(2,2)
	req.checkBody('afternoon', 'Invalid afternoon location').len(2,2)
	req.getValidationResult()
	.then((result) =>{
	    if (!result.isEmpty()) {
	    	req.flash('error', 'There have been validation errors: ' + util.inspect(result.array()));
	      	res.redirect('/config/day/'+req.body.day)
	    }
	    else{

	    	Day.findOrCreate(req.body.day, req.body.morning, req.body.afternoon)

	    	.then((results) => {
	    		req.flash('success', 'The calendar has been updated, thank you')
	    		res.redirect('/config/day/'+req.body.day)
	    	})
	    	.catch((err) => {
	    		req.flash('error', 'Sorry, an error has occured while attempting to update the calendar ' + err)
			    res.redirect('/config/day/'+req.body.day)
			})
	    }
  	})
})

module.exports = router