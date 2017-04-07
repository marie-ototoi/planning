const isHeroku = process.env.MONGODB_URI
if (!isHeroku) require('dotenv').config()

const bodyParser = require('body-parser')
const dbConnect = require('./models/connection')
const express = require('express')
const expressValidator = require('express-validator')
const flash = require('connect-flash')
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const validator = require('validator')

const router = express()
router.set('port', (process.env.PORT || 5000))
router.set('view engine', 'pug')

exports.startServer = function startServer (port, path, callback) {
    router.use(express.static(__dirname + '/public'))
    router.use(flash())
    router.use(bodyParser.json())
    router.use(bodyParser.urlencoded({ extended: true }))
    router.use(methodOverride((req) => req.body._method))
    router.use(expressValidator({
        customValidators: {
            eachIsUrl: function (values) {
                return values.every(function (val) {
                    return validator.isURL(val)
                })
            }
        }
    }))
    router.use(session({
        name: 'otocalendar',
        secret: 'totoi',
        resave: true,
        saveUninitialized: true,
        cookie: { }
    }))
    router.use(passport.initialize())
    router.use(passport.session())

    router.use('/', function (req, res, next) {
        if (req.path === '/favicon.ico') {
            res.writeHead(200, { 'Content-Type': 'image/x-icon' })
            res.end()
            return
        }
        // console.log(req.user, req.path)
        res.locals.query = req.query
        res.locals.url = req.url
        res.locals.user = req.user
        res.locals.flash = req.flash()
        req.session.currentUrl = req.path
        // console.log("currentUrl", req.path)
        next()
    })

    router.use(require('./controllers'))

    router.listen(router.get('port'), function () {
        console.log('Node app is running on port', router.get('port'))
    })

    if (callback) callback()
}

if (isHeroku) exports.startServer()
