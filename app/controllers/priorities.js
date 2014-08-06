'use strict';

var Priority = require('../models/priority');

exports.init = function(req, res){
  res.render('priorities/init');
};

exports.create = function(req, res){
  Priority.create(req.body, function(){
    res.redirect('/priorities');
  });
};

exports.index = function(req, res){
  Priority.all(function(priorities){
    res.render('priorities/index', {priorities:priorities});
  });
};

