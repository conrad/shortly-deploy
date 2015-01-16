var mongoose = require('mongoose');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');

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

linkSchema.pre('save', function(next) {
  var shasum = crypto.createHash('sha1');
  shasum.update(this.url);
  this.code  = shasum.digest('hex').slice(0, 5);
  next();
});

// this makes the link collection accessible in other files
mongoose.model('Link', linkSchema);

var userSchema = mongoose.Schema({
  username: String,
  password: String
});

userSchema.pre('save', function(next) {
  var cipher = Promise.promisify(bcrypt.hash);
  return cipher(this.password, null, null).bind(this)
    .then(function(hash) {
      this.password = hash;
    })
    .then(next);

// Asynch callbacks were not completing in time...
// bcrypt.hash(this.password, null, null, function(err, hash) {
//   this.password = hash;
//   console.log('THIS.PASSWORD',this.password);
//   this.save();
//   next();
// });

// This worked, but it's synchronous
  // var hash = bcrypt.hashSync(this.password, null);
  // this.password = hash;
  // next();
});

mongoose.model('User', userSchema);
// });


// module.exports = db;

