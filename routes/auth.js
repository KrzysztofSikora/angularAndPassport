/**
 * Created by krzysztof on 23.06.16.
 */
var express = require('express');
var router = express.Router();
var bcrypt = require('bcryptjs');


var passport = require('passport');
var mongoose = require('mongoose');
var LocalStrategy = require('passport-local').Strategy;


var user = require('../models/usermodel.js');
var User = mongoose.model('User');

var session = require('express-session');
var MongoStore = require('connect-mongo/es5')(session); // tutaj es5 zależy od wersji node

router.use(session({
    store: new MongoStore({
        url: 'mongodb://localhost:/angularowe'
    }),
    secret: 'codetutorialsecret',
    resave: true,
    saveUninitialized: true
}));

router.use(passport.initialize());

router.use(passport.session());

router.post('/auth/signup', function (req, res) {
    console.log('post');
    var u = new User();
    u.username = req.body.email;
    u.password = req.body.password;
    u.lastname = req.body.lastname;
    u.firstname = req.body.firstname;
    u.email = req.body.email;

    User.createUser(u, function (err, user) {
            if (err) {
                res.json({'alert':'Registration error'});
            }else{
                res.json({'alert':'Registration success'});
            }
        
    });
    
});



passport.use(new LocalStrategy(
    function (username, password, done) {

        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, {alert: 'Incorrect username.'});

            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, {alert: 'Incorrect password.'});
                }
            })
        })
            
        

    }
));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

function isAuthenticated(req, res, next) {
    if (req.isAuthenticated())return next();
    res.send(401);
}

router.get('/test', function (req, res) {
    console.log('test');
})

router.post('/auth/login', passport.authenticate('local'), function (req, res) {
    res.json(req.user);
});


router.get('/auth/currentuser', isAuthenticated, function (req, res) {
    res.json(req.user);
    console.log(req.user)
});


router.get('/auth/logout', function (req, res) {
    console.log('logout');
    req.logout();
    res.send(200);
});

module.exports = router;