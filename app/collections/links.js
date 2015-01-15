// NOTE: this file is not needed when using MongoDB
var db = require('../config');
var Link = require('../models/link');
var mongoLink = require('mongoose').model('Link');

var mongoLinks = new mongoLink({

});
var Links = new db.Collection();

Links.model = Link;

module.exports = Links;
