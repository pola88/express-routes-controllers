var express = require('express'),
  _ = require('lodash'),
  Routes = require('./routes').Routes;

var Resource = module.exports = function Resource (app, name, options) {
  Resource._super.call(this, app, name, options);
};

Resource._super = Routes;
Resource.prototype = Object.create(Routes.prototype);

//Generate the action's path without id.
Resource.prototype.path = function(action) {
  var result = this.base;

  if(action === 'show') {
    return null;
  } else {
    switch(action) {
    case 'edit':
    case 'update':
    case 'destroy':
      if(!/\/$/.test(result)) { result += '/'; }
    }

    switch(action) {
    case 'new':
    case 'edit':
      if(!/\/$/.test(result)) { result += '/'; }

      result += action;
    }

    return result;
  }
};
