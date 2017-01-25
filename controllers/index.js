const express = require('express'), 
	router = express.Router(),
	User = require('../models/user'),
	Day = require('../models/day')


router.use('/users', require('./users'))


router.use('/config', function(req, res, next){
	if(req.user && isAuthorizedUser(req.user) >= 2){
		req.user.rights = isAuthorizedUser(req.user)
		next()
	}else{
		req.session.redirect = '/config'
  		res.redirect('/users/login')
  	}
})
router.use('/config', require('./config'))


router.get('/:requestedDate', function(req, res, next){
	if(req.user && isAuthorizedUser(req.user) > 0){
		req.user.rights = isAuthorizedUser(req.user)
		 Day.getDays().then((data) => {
		 	data = data.map((element)=>{
		 		return {type : element.type, date: element._id}
		 	})
		 	res.render('planning.pug',{title : 'Planning CIFRE', requestedDate: req.params.requestedDate, user: req.user, data : JSON.stringify(data)})
			res.end()
		 })
		
	}else{
		req.session.redirect = '/' + req.params.requestedDate
		//req.flash('error', 'You are not allowed to access this page. Please contact marie@ototoi.fr')
  		res.redirect('/users/login')
  	}
})

router.get('/', function(req, res){
	if(req.user && isAuthorizedUser(req.user) > 0){
		req.user.rights = isAuthorizedUser(req.user)
		 Day.getDays().then((data) => {
		 	data = data.map((element)=>{
		 		return {type : element.type, date: element._id}
		 	})
			res.render('planning.pug',{title : 'Planning CIFRE', user: req.user, data : JSON.stringify(data)})
			res.end()
		})
	}else{
		//req.flash('error', 'You are not allowed to access this page. Please contact marie@ototoi.fr')
  		res.redirect('/users/login')
  	}
})


function isAuthorizedUser(user){
	if( process.env.admin_users && process.env.admin_users.includes(user._id)){
		return 2
	}else if( process.env.autorized_users && process.env.autorized_users.includes(user._id) ){
		return 1
	}
	return 0
}

module.exports = router