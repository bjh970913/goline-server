var express = require('express');
var util = require("util");
var io = require('socket.io')(8081);
var shortid = require('shortid');
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

router.get('/play', function(req, res, next) {
    res.end(JSON.stringify(req));
});

/* Create room */
router.post('/create', function(req, res, next) {
    var manager = req.body.user_id;
    var room = new Room({
        users: [ manager ],
        bound: {
            'latitudeMin': req.body.min_latitude,
            'latitudeMax': req.body.max_latitude,
            'longitudeMin': req.body.min_longitude,
            'longitudeMax': req.body.max_longitude
        }
    });
    res.render('create', { roomId: room.roomId});
});

/* Join room */
router.post('/join', function(req, res, next) {
    Room.where({ 'roomId': req.body.room_id }).findOne(function (err, room) {
        if(err) {
            res.send('not found');
        }
        if(room) {
            room.users.push(user_id);
            res.send(room.users);
        }
    });
});

/* Update user location */
router.post('/update', function(req, res, next) {
    Data.where({ 'userId': req.body.user_id }).findOne(function (err, data) {
        data.path.push({
            'latitude': req.body.latitude,
            'longitude': req.body.longitude
        });
    });

    io.sockets.emit(req);
});

module.exports = router;
