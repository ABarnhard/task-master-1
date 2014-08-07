/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect;
var Task      = require('../../app/models/task');
var dbConnect = require('../../app/lib/mongodb');
var Mongo     = require('mongodb');
var cp        = require('child_process');
var db        = 'tm-test';

describe('Task', function(){
  before(function(done){
    dbConnect(db, function(){
      done();
    });
  });

  beforeEach(function(done){
    cp.execFile(__dirname + '/../scripts/freshdb.sh', [db], {cwd:__dirname + '/../scripts'}, function(){
      done();
    });
  });

  describe('constructor', function(){
    it('should create a new Task object', function(){
      var o = {name:'Dishes', due:'3/11/2004', photo:'d1.jpg', tags:'a,b,c', priorityId:'53d01ddf4fbbd6de0b530014'};
      var t = new Task(o);
      expect(t).to.be.instanceof(Task);
      expect(t.name).to.equal('Dishes');
      expect(t.due).to.be.instanceof(Date);
      expect(t.photo).to.equal('d1.jpg');
      expect(t.isComplete).to.be.false;
      expect(t.tags).to.have.length(3);
      expect(t.priorityId).to.be.instanceof(Mongo.ObjectID);
    });
  });

  describe('.create', function(){
    it('should save a new Task object', function(done){
      Task.create({name:'Dishes', due:'3/11/2004', photo:'d1.jpg', tags:'a,b,c', priorityId:'53d01ddf4fbbd6de0b530014'}, function(err, task){
        expect(task._id).to.be.instanceof(Mongo.ObjectID);
        expect(task).to.be.instanceof(Task);
        expect(task.name).to.equal('Dishes');
        expect(task.due).to.be.instanceof(Date);
        expect(task.photo).to.equal('d1.jpg');
        expect(task.isComplete).to.be.false;
        expect(task.tags).to.have.length(3);
        expect(task.priorityId).to.be.instanceof(Mongo.ObjectID);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a task by its id - as string', function(done){
      Task.findById('53d01ddf4fbbd6de0b530020', function(task){
        expect(task.name).to.equal('Gas');
        expect(task).to.be.instanceof(Task);
        done();
      });
    });

    it('should find a task by its id - as object id', function(done){
      Task.findById(Mongo.ObjectID('53d01ddf4fbbd6de0b530020'), function(task){
        expect(task.name).to.equal('Gas');
        expect(task).to.be.instanceof(Task);
        done();
      });
    });
  });

  describe('#toggle', function(){
    it('should toggle a task from not complete to complete', function(done){
      Task.findById('53d01ddf4fbbd6de0b530021', function(task){
        task.toggle(function(){
          Task.findById('53d01ddf4fbbd6de0b530021', function(task){
            expect(task.isComplete).to.be.true;
            done();
          });
        });
      });
    });
  });
});

