var dbCon = require('./db');
var mongoose = require('mongoose');

var roomSchema = mongoose.Schema({
    users: Array
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
