'use strict';

var Mongo = require('mongodb');
var _     = require('lodash');

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

module.exports = Task;

// PRIVATE FUNCTIONS ///

function changePrototype(obj){
  return _.create(Task.prototype, obj);
}

