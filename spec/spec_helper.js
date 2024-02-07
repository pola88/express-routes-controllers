import _ from 'lodash';
import request from 'request';

const { default: config } = await import('config');

const Request = function () {};

Request.prototype = {
  options: {},
  execute(callback) {
    const that = this;
    callback = _.bind(callback, that);
    request(this.options, function (error, response, body) {
      try {
        body = JSON.parse(body);
      } catch (e) {
        body = body;
      }

      callback(error, response, body);
    });
  },
};

beforeEach(function () {
  this.request = new Request();

  this.request.options = {
    method: 'get',
    url: config.url,
  };
});
