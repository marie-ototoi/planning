var express = require('express'), 
	router = express.Router(),
	passport = require('passport'),
	TwitterStrategy = require('passport-twitter'),
	User = require('../models/user')
	//,

router.get('/login', function(req, res){
	res.render('login.pug',{title : 'Planning CIFRE - Authentification'})
})

passport.use(new TwitterStrategy({
  	// ** keys defined in heroku environment or private/passport.js **
  	consumerKey: process.env.twitter_consumerKey  ,
  	consumerSecret: process.env.twitter_consumerSecret ,
  	callbackURL: '/users/auth/twitter/callback'
}, (token, tokenSecret, profile, done) => {
  	User.findOrCreateByAuth(`@${profile.username}`, profile.displayName, 'twitter', done)
}))

const PROVIDERS = ['twitter']
PROVIDERS.forEach((provider) => {
  	router.get(`/login/${provider}`, passport.authenticate(provider))
  	router.get(`/auth/${provider}/callback`, passport.authenticate(provider, { failureRedirect: '/login' }), function(req, res){
  		res.redirect('/');
  	})
})

passport.serializeUser((id, done) => {
  	done(null, id)
})

passport.deserializeUser((id, done) => {
  	User.findById(id, done)
})


router.get('/logout', function logout (req, res) {
  	req.logout()
  	//req.flash('success', 'Vous avez bien été déconnecté-e')
  	res.redirect('/login')
})

module.exports = router