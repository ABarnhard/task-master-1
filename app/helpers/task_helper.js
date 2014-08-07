'use strict';

var _ = require('lodash');

exports.pager = function(query, count){
  count = Math.ceil(count/3);
  var links = '';

  for(var i = 1; i <= count; i++){
    links += exports.url(query, 'page', i, i);
  }

  return links;
};

exports.url = function(query, key, value, text){
  var q = _.cloneDeep(query);
  q[key] = value;

  var link = '<a href="/tasks?';

  var properties = Object.keys(q).map(function(prop){
    return prop + '=' + q[prop];
  });

  link += properties.join('&');

  link += '">' + text + '</a>';
  return link;
};

exports.tags = function(query, tags){
  var links = tags.map(function(tag){
    return exports.url({}, 'tag', tag, tag);
  });

  return links.join(',');
};

exports.sort = function(query, name, display){
  var direction = query.direction ? query.direction * -1 : 1;
  var tag = query.tag || '';
  var link = '<a href="/tasks?tag='+tag+'&sort='+name+'&direction='+direction+'">'+display+'</a>';
  return link;
};

