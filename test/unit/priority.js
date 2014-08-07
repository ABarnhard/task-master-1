/* jshint expr:true */
/* global describe, it, before, beforeEach */

'use strict';

var expect    = require('chai').expect;
var Priority  = require('../../app/models/priority');
var dbConnect = require('../../app/lib/mongodb');
var Mongo     = require('mongodb');

var medium;

describe('Priority', function(){
  before(function(done){
    dbConnect('tm-test', function(){
      done();
    });
  });

  beforeEach(function(done){
    Priority.collection.remove(function(){
      Priority.create({name:'Medium', color:'#ff00ff', value:'5'}, function(err, priority){
        medium = priority;
        done();
      });
    });
  });

  describe('constructor', function(){
    it('should create a new Priority object', function(){
      var o = {name:'High', color:'pink', value: '10'};
      var high = new Priority(o);

      expect(high).to.be.instanceof(Priority);
      expect(high.name).to.equal('High');
      expect(high.color).to.equal('pink');
      expect(high.value).to.equal(10);
    });
  });

  describe('.create', function(){
    it('should create a priority', function(done){
      Priority.create({name:'High', color:'pink', value: '10'}, function(err, priority){
        expect(priority._id).to.be.instanceof(Mongo.ObjectID);
        expect(priority.name).to.equal('High');
        expect(priority.color).to.equal('pink');
        expect(priority.value).to.equal(10);
        done();
      });
    });
  });

  describe('.all', function(){
    it('should get all priorities from database', function(done){
      Priority.all(function(err, priorities){
        expect(priorities).to.have.length(1);
        done();
      });
    });
  });

  describe('.findById', function(){
    it('should find a priority by its id - as string', function(done){
      Priority.findById(medium._id.toString(), function(err, priority){
        expect(priority.name).to.equal('Medium');
        done();
      });
    });

    it('should find a priority by its id - as object id', function(done){
      Priority.findById(medium._id, function(err, priority){
        expect(priority.name).to.equal('Medium');
        done();
      });
    });
  });
});

