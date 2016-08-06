var dbCon = require('./db');
var mongoose = require('mongoose');
var shortid = require('shortid');

var dataSchema = mongoose.Schema({
    userId: {
        type: String,
        unique: true,
        'default': shortid.generate
    },
    path: Array,
    complete: Boolean,
    area: Number
});

var Data = mongoose.model('Data', dataSchema);

module.exports = Data;
