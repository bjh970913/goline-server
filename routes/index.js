var express = require('express');
var util = require("util");
var router = express.Router();
var Data = require('../database/data');
var Room = require('../database/room');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'Express' });
});

router.get('/mongoT', function(req, res, next) {
    console.log(Data);
    var silence = new Data({ area: 12 });
    silence.save();
    console.log(req);
    res.end(JSON.stringify(silence));
});

/* POST home page. */
router.get('/create', function(req, res, next) {
    res.end(JSON.stringify(req));
});

router.get('/join', function(req, res, next) {
    res.end(JSON.stringify(req));
});

router.get('/play', function(req, res, next) {
    res.end(JSON.stringify(req));
});


/* POST home page. */
router.post('/create', function(req, res, next) {
    res.end(JSON.stringify(req));
});

router.post('/join', function(req, res, next) {
    res.end(JSON.stringify(req));
});

router.post('/update', function(req, res, next) {
    res.end(JSON.stringify(req));
});

module.exports = router;
