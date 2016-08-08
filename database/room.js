var dbCon = require('./db');
var mongoose = require('mongoose');
var shortid = require('shortid');

var roomSchema = mongoose.Schema({
    roomId: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    users: Array,
    score: Array,
    bound: {},
    time : {
        type : Date,
        default: Date.now
    }
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
