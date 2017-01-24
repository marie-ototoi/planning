var express = require('express'),
	app = express(),
	session = require('express-session'),
	expressValidator = require('express-validator'),
	bodyParser = require('body-parser'),

	flash = require('connect-flash'),
	methodOverride = require('method-override'),
	passport = require('passport'),
	dbConnect = require('./models/connection')



app.set('port', (process.env.PORT || 5000));
app.set('view engine', 'pug');




app.use(express.static(__dirname + '/public'))

app.use(flash())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(methodOverride((req) => req.body._method))
app.use(expressValidator())


app.use(session({
	name : 'otocalendar',
  	secret: 'totoi',
  	resave: true,
  	saveUninitialized : true,
  	cookie: { }
}))

app.use(passport.initialize())
app.use(passport.session()) 

app.use('/', function(req, res, next){
	if (req.path === '/favicon.ico') {
	    res.writeHead(200, {'Content-Type': 'image/x-icon'} )
	    res.end()
	    return
	}
	//console.log(req.user, req.path)
	res.locals.query = req.query
	res.locals.url = req.url
	res.locals.user = req.user
	res.locals.flash = req.flash()
	req.session.currentUrl = req.path
	//console.log("currentUrl", req.path)
	next()
})


app.use(require('./controllers'))


app.listen(app.get('port'), function() {
  //console.log('Node app is running on port', app.get('port'));
})