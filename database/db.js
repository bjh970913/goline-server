var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/goline');

module.exports = mongoose;
