var dbCon = require('./db');
var mongoose = require('mongoose');
var shortid = require('shortid');

var roomSchema = mongoose.Schema({
    roomId: {
        type: String,
        unique: true
    },
    users: Array,
    bound: {},
    time : {
        type : Date,
        default: Date.now
    }
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
