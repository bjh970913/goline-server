var dbCon = require('./db');

var roomSchema = mongoose.Schema({
    id: Number,
    users: Array
});

var Room = mongoose.model('Room', roomSchema);

module.exports = Room;
