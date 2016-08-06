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
    var body = req.body;
    var manager = body.user_id;

    var newRoom = new Room({
        users: [ manager ],
        bound: {
            'latitudeMin': body.min_latitude,
            'latitudeMax': body.max_latitude,
            'longitudeMin': body.min_longitude,
            'longitudeMax': body.max_longitude
        }
    });
    newRoom.save();

    var data = new Data({userId: manager});
    data.save();

    res.render('create', { roomId: newRoom.roomId});
});

router.get('/create', function(req, res, next) {
    res.render('create', { roomId: -1});
});

/* Join room */
router.post('/join', function(req, res, next) {
    var body = req.body;
    Room.where({ 'roomId': body.room_id }).findOne(function (err, room) {
        console.log(err, room);
        if (room) {
            room.users.push(body.user_id);

            room.users = room.users.filter(function(elem, pos) {
                return room.users.indexOf(elem) == pos;
            })

            room.save();

            // TODO
            // find user from data and delete

            var data = new Data({userId: body.user_id});
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
    var body = req.body;
    var userId = body.user_id;
    var pos = {
        'latitude': body.latitude,
        'longitude': body.longitude
    }

    Room.where({ 'roomId': body.room_id }).findOne(function (err, room) {
        LatLng = room.bound;

        var time = new Date();
        time = (time - room.time)/60000;
        var msg;

        if (time>= 10) {
            res.end(JSON.stringify({'msg': 'game_end_timeout'}));
        } else {
            Data.where({'userId': userId}).findOne(function(err, data){
                data.path.push(pos);
                data.save();

                io.sockets.in(body.room_id).emit('update', {userId: userId, pos: pos});

                if (time > 2) {
                    var startPoint = data.path[0];

                    var lng = Math.pow(startPoint.longitude - pos.longitude, 2);
                    var lat = Math.pow(startPoint.latitude - pos.latitude, 2);

                    var dis = Math.sqrt(lng+lat) * 100000;

                    if (dis <= 16*Math.sqrt(2)) {
                        res.end(JSON.stringify({'msg': 'game_end_calc_score'}));
                        io.sockets.in(body.room_id).emit('end', {userId: userId});
                        data.complete = true;
                        data.save();
                    }
                }
                res.end(JSON.stringify({'msg': 'game_update_ok'}));
            });
        }
    });
});


router.get('/invite', function(req, res) {
    res.render('open_app');
});


io.on('connection', function(socket) {
    socket.emit('connected');
    socket.on('init', function(data){
        var sdata = {};
        roomId = data.roomId;
        socket.join(roomId);
        socket.ID = roomId;

        Room.where({ 'roomId': roomId }).findOne(function (err, room) {
            var cursor = Data.find().where('userId').in(room.users).exec(function(err, docs) {
                // console.log(docs, b);
                sdata['paths'] = docs;
                sdata['bound'] = room.bound;
                
                console.log(sdata);
                socket.emit('init', sdata);
            });

        });
    });
});

module.exports = router;
