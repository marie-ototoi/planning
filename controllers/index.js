var express = require('express'), 
	router = express.Router()
	//,
	//auth = require('../middlewares/auth')

router.use('/users', require('./users'))



router.get('/users/login', function(req, res){
	res.render('login.pug',{title : 'Planning CIFRE - Authentification'})
})

router.get('/', function(req, res){
	if(req.user && isAuthorizedUser(req.user) > 0){
		req.user.rights = isAuthorizedUser(req.user)
		res.render('planning.pug',{title : 'Planning CIFRE'})
	}
	//req.flash('error', 'You are not allowed to access this page. Please contact marie@ototoi.fr')
  	res.redirect('/users/login')
})

router.get('/:requestedDate', function(req, res){
	if(req.user && isAuthorizedUser(req.user) > 0){
		req.user.rights = isAuthorizedUser(req.user)
		return res.render('planning.pug',{title : 'Planning CIFRE', requestedDate: req.params.requestedDate}) 
	}
	//req.flash('error', 'You are not allowed to access this page. Please contact marie@ototoi.fr')
  	res.redirect('/users/login')
})



function isAuthorizedUser(user){
	if( process.env.autorized_users && process.env.autorized_users.includes(user._id) ){
		return 1
	}else if( process.env.admin_users && process.env.admin_users.includes(user._id)){
		return 2
	}
	return 0
}

module.exports = router