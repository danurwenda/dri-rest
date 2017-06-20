var router = require('express').Router();
var Book = require("../../models/book");
var passport = require('passport');
require('../../config/passport')(passport);

//Create router for add new book that only accessible to authorized user.
router.post('/', passport.authenticate('jwt', {session: false}), function (req, res) {
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
router.get('/', passport.authenticate('jwt', {session: false}), function (req, res) {
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

module.exports= router;