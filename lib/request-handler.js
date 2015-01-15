var request = require('request');
var crypto = require('crypto');
var bcrypt = require('bcrypt-nodejs');
var util = require('../lib/utility');
var mongoose = require('mongoose');
var mongoUser = mongoose.model('User');

mongoUser.find(function(err, users) {
  if (err) {
    console.error('error!');
  } else {
    console.log('in database: ', users);
  }
});

var db = require('../app/config');
var User = require('../app/models/user');
var Link = require('../app/models/link');
var Users = require('../app/collections/users');
var Links = require('../app/collections/links');

exports.renderIndex = function(req, res) {
  res.render('index');
};

exports.signupUserForm = function(req, res) {
  res.render('signup');
};

exports.loginUserForm = function(req, res) {
  res.render('login');
};

exports.logoutUser = function(req, res) {
  req.session.destroy(function(){
    res.redirect('/login');
  });
};

exports.fetchLinks = function(req, res) {
  Links.reset().fetch().then(function(links) {
    res.send(200, links.models);
  })
};

exports.saveLink = function(req, res) {
  var uri = req.body.url;

  if (!util.isValidUrl(uri)) {
    console.log('Not a valid url: ', uri);
    return res.send(404);
  }

  new Link({ url: uri }).fetch().then(function(found) {
    if (found) {
      res.send(200, found.attributes);
    } else {
      util.getUrlTitle(uri, function(err, title) {
        if (err) {
          console.log('Error reading URL heading: ', err);
          return res.send(404);
        }

        var link = new Link({
          url: uri,
          title: title,
          base_url: req.headers.origin
        });

        link.save().then(function(newLink) {
          Links.add(newLink);
          res.send(200, newLink);
        });
      });
    }
  });
};

exports.loginUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  mongoUser.findOne({'username': username}, 'password', function(err, user) {
    if (err) {
      console.error('error!');
      res.redirect('/login');
    } else {
      bcrypt.compare(password, user.password, function(err, match) {
        if (err) {
          console.error('error!');
          res.redirect('/login');
        } else {
          if (match) {
           util.createSession(req, res, user);
          } else {
            console.log('login failed');
            res.redirect('/login');
          }
        }
      });
    }
  });

  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       res.redirect('/login');
  //     } else {
  //       user.comparePassword(password, function(match) {
  //         if (match) {
  //           util.createSession(req, res, user);
  //         } else {
  //           res.redirect('/login');
  //         }
  //       })
  //     }
  // });
};

exports.signupUser = function(req, res) {
  var username = req.body.username;
  var password = req.body.password;

  bcrypt.hash(password, null, null, function(err, hash) {
    // Creates new instance of user
    var newUser = new mongoUser({
      username: username,
      password: hash
    });
    // Ask if the database already has user with newUser's username
    // If not, save to the database. If yes, don't save to the database
    mongoUser.find(function(err, users) {
      if (err) {
        console.error('error!');
        res.redirect('/signup');
      } else {
        var found = false;
        for (var i = 0; i < users.length; i++) {
          if (users[i].username === newUser.username) {
            found = true;
            break;
          }
        }
        if (!found) {
          newUser.save(function(err, user) {
            if (err) {
              console.log('error!');
              res.redirect('/signup');
            }
            else {
              console.log(user + " saved!");
              util.createSession(req, res, user);
            }
          });
        } else {
          console.log('that name already exists!');
          res.redirect('/signup');
        }
      }
    });

  });


  // new User({ username: username })
  //   .fetch()
  //   .then(function(user) {
  //     if (!user) {
  //       var newUser = new User({
  //         username: username,
  //         password: password
  //       });
  //       newUser.save()
  //         .then(function(newUser) {
  //           util.createSession(req, res, newUser);
  //           Users.add(newUser);
  //         });
  //     } else {
  //       console.log('Account already exists');
  //       res.redirect('/signup');
  //     }
  //   })
};

exports.navToLink = function(req, res) {
  new Link({ code: req.params[0] }).fetch().then(function(link) {
    if (!link) {
      res.redirect('/');
    } else {
      link.set({ visits: link.get('visits') + 1 })
        .save()
        .then(function() {
          return res.redirect(link.get('url'));
        });
    }
  });
};
