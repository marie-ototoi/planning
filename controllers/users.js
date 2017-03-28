const express = require('express')
const passport = require('passport')
const TwitterStrategy = require('passport-twitter')
const User = require('../models/user')

const router = express.Router()

router.get('/login', function (req, res) {
    res.render('login', { title: 'Planning CIFRE - Authentification' })
})

passport.use(new TwitterStrategy({
    // ** keys defined in heroku environment or private/passport.js **
    consumerKey: process.env.twitter_consumerKey,
    consumerSecret: process.env.twitter_consumerSecret,
    callbackURL: '/users/auth/twitter/callback'
}, (token, tokenSecret, profile, done) => {
    User.findOrCreateByAuth(`@${profile.username}`, profile.displayName, 'twitter', done)
}))

const PROVIDERS = ['twitter']
PROVIDERS.forEach((provider) => {
    router.get(`/login/${provider}`, passport.authenticate(provider))
    router.get(`/auth/${provider}/callback`, passport.authenticate(provider, { failureRedirect: '/login' }), function (req, res) {
        if (req.session.redirect) {
            res.redirect(req.session.redirect)
            req.session.redirect = null
        } else {
            res.redirect('/')
        }
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
    // req.flash('success', 'Vous avez bien été déconnecté-e')
    res.redirect('/login')
})

module.exports = router
