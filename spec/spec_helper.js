var request = require('request');
var _ = require('lodash');
var config = require('config');

var Request = function() {};

Request.prototype = {
  options: {},
  execute: function(callback) {
    var that = this;
    callback = _.bind(callback,that);
    request(this.options, function(error, response, body) {
      var body;
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = body;
      }

      callback(error, response, body);
    });
  }
};

beforeEach(function() {
  this.request = new Request();

  this.request.options = {
      method: 'get',
      url: config.url
  };
});
