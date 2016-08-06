var express = require('express');
var util = require("util");
var io = require('socket.io')(8081);
var shortid = require('shortid');
var router = express.Router();
var Data = require('../database/data');
var Room = require('../database/room');

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { roomId: -1 });
});

router.get('/mongoT', function(req, res, next) {
    var silence = new Data({ area: 12 });
    silence.save();
    res.end(JSON.stringify(silence));
});

router.get('/play', function(req, res, next) {
    res.render('index', { roomId: -1 });
});

/* Create room */
router.post('/create', function(req, res, next) {
    var manager = req.body.user_id;
    var newRoom = new Room({
        users: [ manager ],
        bound: {
            'latitudeMin': req.body.min_latitude,
            'latitudeMax': req.body.max_latitude,
            'longitudeMin': req.body.min_longitude,
            'longitudeMax': req.body.max_longitude
        }
    });
    newRoom.save();

    res.render('create', { roomId: newRoom.roomId});
});

router.get('/create', function(req, res, next) {
    res.render('create', { roomId: -1});
});

/* Join room */
router.post('/join', function(req, res, next) {
    Room.where({ 'roomId': req.body.room_id }).findOne(function (err, room) {
        console.log(err, room);
        if (room) {
            room.users.push(req.body.user_id);
            res.end(JSON.stringify({ roomId: room.roomId}));
        } else {
            res.end(JSON.stringify({'not found'}));
        }
    });
});

/* Update user location */
router.post('/update', function(req, res, next) {
    var bound;
    var userId = req.body.user_id;
    var pos = {
        'latitude': lat,
        'longitude': lng
    }

    Data.where({ 'roomId': req.body.room_id }).findOne(function (err, room) {
        bound = room.bound;
    });

    if (pos.latitude > bound.latitudeMax
     || pos.latitude < bound.latitudeMin
     || pos.longitude > bound.longitudeMax
     || pos.longitude < bound.longitudeMin) {
        return;
    }

    Data.where({ 'userId': userId }).findOne(function (err, data) {
        data.path.push(pos);
    });

    io.sockets.emit({
        userId: [pos]
    });
});

io.on('connection', function(socket) {
    var sdata = {};

    Data.where({ 'roomId': req.body.room_id }).findOne(function (err, room) {
        for (var user in room.users) {
            Data.where({ 'userId': user }).findOne(function (err, data) {
                sdata[user] = data.path;
            });
        }
    });

    socket.emit('update', sdata);
});

module.exports = router;
