'use strict';

var Mongo = require('mongodb');

function Priority(o){
  this.name  = o.name;
  this.color = o.color;
  this.value = parseInt(o.value);
}

Object.defineProperty(Priority, 'collection', {
  get: function(){return global.mongodb.collection('priorities');}
});

Priority.create = function(o, cb){
  var p = new Priority(o);
  Priority.collection.save(p, cb);
};

Priority.all = function(cb){
  Priority.collection.find().toArray(cb);
};

Priority.findById = function(id, cb){
  var _id = Mongo.ObjectID(id);
  Priority.collection.findOne({_id:_id}, cb);
};

module.exports = Priority;

