var dbCon = require('./db');

var dataSchema = mongoose.Schema({
    userId: Number,
    path: Array,
    complete: Boolean,
    area: Number
});

var Data = mongoose.model('Data', dataSchema);

module.exports = Data;
