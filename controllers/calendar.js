const express = require('express')
const CalendarStream = require('../models/calendarStream')
const Day = require('../models/day')

const router = express.Router()

// check user rights and save them in req.user object
// applied to all routes
router.use('/', function (req, res, next) {
    if (!req.user) req.user = {}
    req.user.rights = getUserRights(req.user._id, {
        autorizedUsers: process.env.autorized_users,
        adminUsers: process.env.admin_users
    })
    next()
})

// if a date (YY-mm) is specified in main route
router.get('/:requestedDate', function (req, res, next) {
    renderHome(req, res, req.params.requestedDate)
})

// if no date is specified in main route
router.get('/', function (req, res) {
    renderHome(req, res, '')
})

/**
 * Get data and renders home if the user has permission
 * @param {Object} user_id - Unique identifier of the user.
 * @param {Object} authorized - Lists of authorized users coming from environment variables.
 * @param {string} requestedDate - YY-mm date or ''.
 */
function renderHome (req, res, requestedDate) {
    if (req.user.rights.includes('view')) {
        Promise.all([
            Day.getDays(),
            CalendarStream.getAllCalendarsData()
        ])
        .then(([data, icalData]) => {
            res.render('calendar', {
                title: 'Planning CIFRE',
                user: req.user,
                data: JSON.stringify(data),
                icalData: JSON.stringify(icalData),
                requestedDate
            })
            res.end()
        })
        .catch(err => {
            req.flash('error', 'Error retrieving data' + err)
            res.redirect('/users/login')
        })
    } else {
        req.session.redirect = '/' + requestedDate
        req.flash('error', 'You are not allowed to access this page. Please contact marie@ototoi.fr')
        res.redirect('/users/login')
    }
}

/**
 * Returns the list of rights of the user
 * @param {string} user_id - Unique identifier of the user.
 * @param {Object} authorized - Lists of authorized users coming from environment variables.
 * @param {string} authorized.adminUsers - Admin users.
 * @param {string} authorized.autorizedUsers - Other users.
 * @returns {Array} list of rights.
 */
function getUserRights (userId, authorized) {
    // deactivate authentication for development
    if (process.env.context && process.env.context === 'DEV') return ['admin', 'view']
    let rights = []
    if (authorized.adminUsers.includes(userId)) {
        rights.push('admin', 'view')
    } else if (authorized.autorizedUsers.includes(userId)) {
        rights.push('view')
    }
    return rights
}

module.exports = router
module.exports.getUserRights = getUserRights
