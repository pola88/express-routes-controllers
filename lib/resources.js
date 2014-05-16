var express = require('express'),
    _ = require('lodash'),
    Routes = require('./routes').Routes;

var Resources = module.exports = function Resources(app, name, options) {
  Resources._super.call(this, app, name, options);
};

Resources._super = Routes;
Resources.prototype = Object.create(Routes.prototype);

/*
  app.resources

  @param {String} controller name
  @param {Object} [options]
  @param {function} nested controller
*/
express.application.resources = function(name, options, callback) {
  if('function' == typeof options) {
    callback = options;
    options = {};
  }
  
  var controller = this._load(name);
  var resources = new Resources(this, name, _.merge(controller.options, options));
  
  resources._init(controller);

  if('function' == typeof callback) {
    resources._nest(callback);
  }
  
  return resources;
}