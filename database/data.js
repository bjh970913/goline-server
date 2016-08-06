var dbCon = require('./db');
var mongoose = require('mongoose');
var shortid = require('shortid');

var dataSchema = mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    roomId: {
        type: String,
    },
    path: Array,
    complete: {
        type: Boolean,
        'default': false
    },
    score: {
        type: Number,
        'default': 0
    }
});

var Data = mongoose.model('Data', dataSchema);

module.exports = Data;
