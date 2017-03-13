const CalendarStream = require('../models/calendarStream')
const express = require('express')
const rp = require('request-promise')
const User = require('../models/user')
const Day = require('../models/day')

const router = express.Router()

router.use('/users', require('./users'))

router.use('/config', function (req, res, next) {
    if (req.user && isAuthorizedUser(req.user) >= 2) {
        req.user.rights = isAuthorizedUser(req.user)
        next()
    } else {
        req.session.redirect = '/config' + req.path
        res.redirect('/users/login')
    }
})
router.use('/config', require('./config'))

router.get('/:requestedDate', function (req, res, next) {
    if (req.user && isAuthorizedUser(req.user) > 0) {
        req.user.rights = isAuthorizedUser(req.user)
        Promise.all([
            Day.getDays(),
            CalendarStream.getAllCalendarsData()
            // CalendarStream.getCalendarData('http://p53-calendars.icloud.com/published/2/SI9lZaSUYZZCZfA4SiWgGO1gHWVCUYZV4tPi2HoWGiwM5PY5KyXgDz42F8a5dA85iyGtkqr12PjPdyaRKsqDD5wM55EkxXRfr31HIYYYy-A')
        ])
        .then(([data, icalData]) => {
            res.render('calendar.pug', {
                title: 'Planning CIFRE',
                requestedDate: req.params.requestedDate,
                user: req.user,
                data: JSON.stringify(data),
                icalData: JSON.stringify(icalData)
            })
            res.end()
        })
        .catch(err => {
            console.error('Error retrieving data' + err)
        })
    } else {
        req.session.redirect = '/' + req.params.requestedDate
        // req.flash('error', 'You are not allowed to access this page. Please contact marie@ototoi.fr')
        res.redirect('/users/login')
    }
})

router.get('/', function (req, res) {
    if (req.user && isAuthorizedUser(req.user) > 0) {
        req.user.rights = isAuthorizedUser(req.user)
        Promise.all([
            Day.getDays(),
            CalendarStream.getAllCalendarsData()
            // CalendarStream.getCalendarData('http://p53-calendars.icloud.com/published/2/SI9lZaSUYZZCZfA4SiWgGO1gHWVCUYZV4tPi2HoWGiwM5PY5KyXgDz42F8a5dA85iyGtkqr12PjPdyaRKsqDD5wM55EkxXRfr31HIYYYy-A')
        ])
        .then(([data, icalData]) => {
            res.render('calendar.pug', {
                title: 'Planning CIFRE',
                user: req.user,
                data: JSON.stringify(data),
                icalData: JSON.stringify(icalData)
            })
            res.end()
        })
        .catch(err => {
            req.flash('error', 'Error retrieving data' + err)
        })
    } else {
        // req.flash('error', 'You are not allowed to access this page. Please contact marie@ototoi.fr')
        res.redirect('/users/login')
    }
})

function isAuthorizedUser (user) {
    if (process.env.admin_users && process.env.admin_users.includes(user._id)) {
        return 2
    } else if (process.env.autorized_users && process.env.autorized_users.includes(user._id)) {
        return 1
    }
    return 0
}

module.exports = router
