const express = require('express')
const util = require('util')
const CalendarStream = require('../models/calendarStream')
const Day = require('../models/day')

const router = express.Router()

// check user rights
router.all('/', function (req, res, next) {
    if (req.user.rights.includes('admin')) {
        next()
    } else {
        req.session.redirect = '/config' + req.path
        res.redirect('/users/login')
    }
})

// display main config : starting and ending dates + cal
router.get('/', function getConfig (req, res) {
    Promise.all([
        Day.getFirstDay(),
        Day.getLastDay(),
        CalendarStream.getCalendars()
    ])
    .then(([dateStart, dateEnd, calendars]) => {
        res.render('config', {
            title: 'Planning CIFRE - Configuration',
            dateStart: dateStart[0]._id,
            dateEnd: dateEnd[0]._id,
            calendarUrls: JSON.stringify(calendars.map(calendar => calendar.url))
        })
        res.end()
    })
    .catch((err) => {
        req.flash('error', 'Error while getting the data ' + err)
        res.render('config', {title: 'Planning CIFRE - Configuration'})
    })
})

router.post('/', function setConfig (req, res) {
    // console.log('query', req.query,'body', req.body,'params', req.headers)
    req.checkBody('dateStart', '%0 is an invalid starting date').notEmpty().isDate()
    req.checkBody('dateEnd', '%0 is an invalid ending date').notEmpty().isDate()
    if (req.body.calendars) {
        req.body.calendars.forEach((calendar, index) => {
            if (req.body.calendars[index] !== '') req.checkBody('calendars[' + index + ']', '%0 is an invalid url').isURL()
        })
    }
    req.getValidationResult()
    .then((result) => {
        if (!result.isEmpty()) {
            req.flash('error', 'There have been validation errors: ' + util.inspect(result.array()))
            res.redirect('/config')
        } else {
            Day.configCalendar(req.body.dateStart, req.body.dateEnd)
            .then((results) => {
                if (req.body.calendars && req.body.calendars[0] !== '') {
                    return CalendarStream.setCalendars(req.body.calendars)
                } else {
                    return new Promise((resolve, reject) => {
                        resolve()
                    })
                }
            })
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

router.get('/day/:id', function getConfig (req, res) {
    Day.getDay(req.params.id)
    .then(day => {
        if (day) {
            res.render('configDay', {
                title: 'Planning CIFRE - Configuration',
                day: {
                    _id: day.id,
                    morning: day.morning,
                    afternoon: day.afternoon
                },
                types: [
                    { key: 'IL', val: 'ILDA' },
                    { key: 'LO', val: 'Teaching' },
                    { key: 'WO', val: 'External Meeting' },
                    { key: 'CO', val: 'Conference' },
                    { key: 'SC', val: 'Workshop / Seminar' },
                    { key: 'HO', val: 'Holidays' }
                ]
            })
            res.end()
        } else {
            req.flash('error', 'Sorry, the day ' + req.params.id + ' is not part of the timespan')
            res.redirect('/config')
        }
    })
    .catch(err => {
        req.flash('error', 'Sorry, an error has occured while attempting to edit a specific day ' + err)
        res.redirect('/config')
    })
})

router.post('/day/:id', function setDay (req, res) {
    req.checkBody('day', 'Invalid date').notEmpty().isDate()
    req.checkBody('morning', 'Invalid morning location').len(2, 2)
    req.checkBody('afternoon', 'Invalid afternoon location').len(2, 2)
    req.getValidationResult()
    .then((result) => {
        if (!result.isEmpty()) {
            req.flash('error', 'There have been validation errors: ' + util.inspect(result.array()))
            res.redirect('/config/day/' + req.body.day)
        } else {
            Day.findOrCreate(req.body.day, req.body.morning, req.body.afternoon)
            .then((results) => {
                req.flash('success', 'The calendar has been updated, thank you')
                res.redirect('/config/day/' + req.body.day)
            })
            .catch((err) => {
                req.flash('error', 'Sorry, an error has occured while attempting to update the calendar ' + err)
                res.redirect('/config/day/' + req.body.day)
            })
        }
    })
})

module.exports = router
