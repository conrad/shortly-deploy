var path = require('path');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  // yay!
  var linkSchema = mongoose.Schema({
    url: String
  });

  var Link = mongoose.model('Link', linkSchema);

  var userSchema = mongoose.Schema({
    username: String
  });

  var User = mongoose.model('User', userSchema);
});


module.exports = db;

