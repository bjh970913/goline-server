var dbCon = require('./db');
var mongoose = require('mongoose');

var dataSchema = mongoose.Schema({
    userId: { type: String, unique: true },
    path: Array,
    complete: Boolean,
    area: Number
});

var Data = mongoose.model('Data', dataSchema);

module.exports = Data;
