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
            room.save();

            var data = new Data({userId: req.body.user_id});
            data.save();

            res.end(JSON.stringify({ 'roomId': room.roomId}));
        } else {
            res.end(JSON.stringify({'error': 'not found'}));
        }
    });
});

/* Update user location */
router.post('/update', function(req, res, next) {
    var LatLng;
    var userId = req.body.user_id;
    var pos = {
        'latitude': req.body.latitude,
        'longitude': req.body.longitude
    }

    Room.where({ 'roomId': req.body.room_id }).findOne(function (err, room) {
        LatLng = room.bound;


        if (pos.latitude > LatLng.latitudeMax
         || pos.latitude < LatLng.latitudeMin
         || pos.longitude > LatLng.longitudeMax
         || pos.longitude < LatLng.longitudeMin) {
            res.end(JSON.stringify({'error': 'out of bound'}));
        }

        Data.where({ 'userId': userId }).findOne(function (err, data) {
            console.log(userId);
            data.path.push(pos);
            data.save();
        });

        io.sockets.emit({
            userId: [pos]
        });

        res.end();
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
