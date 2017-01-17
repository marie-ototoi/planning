var express = require('express'),
app = express(),
session = require('express-session'),
passport = require('passport'),
dbConnect = require('./models/connection')



app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'))


app.use(session({
	name : 'otoplanning',
  	secret: 'totoi',
  	resave: true,
  	saveUninitialized : true,
  	cookie: { }
}))

app.use(passport.initialize())
app.use(passport.session()) 

app.use((req, res, next) => {
  	console.log(req.user)
  	res.locals.user = req.user
  	next()
})

app.use(require('./controllers'))


app.listen(app.get('port'), function() {
  //console.log('Node app is running on port', app.get('port'));
})