var mongoose = require('mongoose');

var linkSchema = mongoose.Schema({
    url: String,
    base_url: String,
    code: String,
    title: String,
    visits: Number
  });

module.exports = mongoose.model('Link', linkSchema);
