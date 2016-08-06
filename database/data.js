var dbCon = require('./db');
var mongoose = require('mongoose');
var shortid = require('shortid');

var dataSchema = mongoose.Schema({
    userId: {
        type: String,
        unique: true
    },
    path: Array,
    complete: {
        type: Boolean,
        'default': false
    },
    area: {
        type: Number,
        'default': 0
    },
    time : {
        type : Date,
        default: Date.now
    }
});

var Data = mongoose.model('Data', dataSchema);

module.exports = Data;
