var config = require('../../config/database');
var router = require('express').Router();
var jwt = require('jsonwebtoken');
var User = require("../../models/user");

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

// split up route handling
router.use('/book', require('./book'));

// Finally, export router as module.
module.exports = router;