var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/test');

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function (callback) {
  // yay!
var linkSchema = mongoose.Schema({
  url: String,
  title: String,
  base_url: String,
  code: String,
  visits: Number
});

// this makes the link collection accessible in other files
mongoose.model('Link', linkSchema);

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

mongoose.model('User', userSchema);
// });


// module.exports = db;

