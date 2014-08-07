'use strict';

var Mongo    = require('mongodb');
var _        = require('lodash');
var async    = require('async');
var Priority = require('./priority');

function Task(o){
  this.name       = o.name;
  this.due        = new Date(o.due);
  this.photo      = o.photo;
  this.isComplete = false;
  this.tags       = o.tags.split(',').map(function(t){return t.trim();});
  this.priorityId = Mongo.ObjectID(o.priorityId);
}

Object.defineProperty(Task, 'collection', {
  get: function(){return global.mongodb.collection('tasks');}
});

Task.prototype.toggle = function(cb){
  this.isComplete = !this.isComplete;
  Task.collection.save(this, cb);
};

Task.count = function(query, cb){
  var filter = query.tag  ? {tags:query.tag} : {};
  Task.collection.find(filter).count(cb);
};

Task.create = function(o, cb){
  var t = new Task(o);
  Task.collection.save(t, cb);
};

Task.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Task.collection.findOne({_id:_id}, function(err, obj){
    var task = changePrototype(obj);
    cb(task);
  });
};

Task.query = function(query, cb){
  var limit  = 3;
  var skip   = query.page ? ((query.page * limit) - limit)     : 0;
  var filter = query.tag  ? {tags:query.tag}                   : {};
  var sort   = {};
  if(query.sort){sort[query.sort] = query.direction * 1;}

  Task.collection.find(filter).sort(sort).skip(skip).limit(limit).toArray(function(err, tasks){
    async.map(tasks, iterator, cb);
  });
};

module.exports = Task;

// PRIVATE FUNCTIONS ///

function iterator(task, cb){
  Priority.findById(task.priorityId, function(err, priority){
    task.priority = priority;
    cb(null, task);
  });
}

function changePrototype(obj){
  return _.create(Task.prototype, obj);
}

