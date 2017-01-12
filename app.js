var express = require('express')

var app = express()

app.set('view engine', 'pug');
app.use('/data', express.static('public/data'));
app.use('/images', express.static('public/images'));
app.use('/scripts', express.static('public/scripts'));
app.use('/styles', express.static('public/styles'));

app.get('/', function(req, res){
	res.render('planning.pug',{title : 'Planning CIFRE'})
})
app.get('/:requestedDate', function(req, res){
	res.render('planning.pug',{title : 'Planning CIFRE', requestedDate: req.params.requestedDate})
})
.listen(8080)