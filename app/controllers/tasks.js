'use strict';

var Priority = require('../models/priority');
var Task = require('../models/task');
var moment = require('moment');
var taskHelper = require('../helpers/task_helper');

exports.init = function(req, res){
  Priority.all(function(err, priorities){
    res.render('tasks/init', {priorities:priorities});
  });
};

exports.create = function(req, res){
  Task.create(req.body, function(){
    res.redirect('/tasks');
  });
};

exports.index = function(req, res){
  Task.query(req.query, function(err, tasks){
    Task.count(req.query, function(err, count){
      res.render('tasks/index', {tasks:tasks, moment:moment, taskHelper:taskHelper, count:count, query:req.query});
    });
  });
};

exports.toggle = function(req, res){
  Task.findById(req.params.id, function(task){
    task.toggle(function(){
      res.redirect('/tasks');
    });
  });
};

