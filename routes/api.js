var config = require('../config/database');
var passport = require('passport');
require('../config/passport')(passport);
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var User = require("../models/user");
var Book = require("../models/book");

// Create router for signup or register new user.
router.post('/signup', function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.json({success: false, msg: 'Please pass username and password.'});
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password
        });
        // save the user
        newUser.save(function (err) {
            if (err) {
                return res.json({success: false, msg: 'Username already exists.', err:err});
            }
            res.json({success: true, msg: 'Successful created new user.'});
        });
    }
});

//Create router for login or signin.
router.post('/signin', function (req, res) {
    User.findOne({
        username: req.body.username
    }, function (err, user) {
        if (err)
            throw err;

        if (!user) {
            res.send({success: false, msg: 'Authentication failed. User not found.'});
        } else {
            // check if password matches
            user.comparePassword(req.body.password, function (err, isMatch) {
                if (isMatch && !err) {
                    // if user is found and password is right create a token
                    var token = jwt.sign(user, config.secret);
                    // return the information including token as JSON
                    res.json({success: true, token: 'JWT ' + token});
                } else {
                    res.send({success: false, msg: 'Authentication failed. Wrong password.'});
                }
            });
        }
    });
});

//Create router for add new book that only accessible to authorized user.
router.post('/book', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        console.log(req.body);
        var newBook = new Book({
            isbn: req.body.isbn,
            title: req.body.title,
            author: req.body.author,
            publisher: req.body.publisher
        });

        newBook.save(function (err) {
            if (err) {
                return res.json({success: false, msg: 'Save book failed.'});
            }
            res.json({success: true, msg: 'Successful created new book.'});
        });
    } else {
        return res.status(401).send({success: false, msg: 'Unauthorized.'});
    }
});

// Create router for get list of books that accessible for authorized user.
router.get('/book', passport.authenticate('jwt', {session: false}), function (req, res) {
    var token = getToken(req.headers);
    if (token) {
        Book.find(function (err, books) {
            if (err)
                return next(err);
            res.json(books);
        });
    } else {
        // actually this part of code is unreachable, since unauthorized request
        // will already be rejected by passport callback
        return res.status(401).send({success: false, msg: 'Unauthorized.'});
    }
});

// Create function for parse authorization token from request headers.
getToken = function (headers) {
    if (headers && headers.authorization) {
        var parted = headers.authorization.split(' ');
        if (parted.length === 2) {
            return parted[1];
        } else {
            return null;
        }
    } else {
        return null;
    }
};

// Finally, export router as module.
module.exports = router;