var express = require('express'),
    _ = require('lodash'),
    Routes = require('./routes').Routes;

var Resources = module.exports = function Resources(app, name, options) {
  Resources._super.call(this, app, name, options);
};

Resources._super = Routes;
Resources.prototype = Object.create(Routes.prototype);