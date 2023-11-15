const express = require('express');
const methodOverride = require('method-override');

const app = express();
// https://github.com/ferlores/easy-routes/tree/master/testing
// configure Express
app.use(express.urlencoded());
app.use(express.json());
app.use(methodOverride());

exports.start = function (config, readyCallback) {
  if (!this.server) {
    this.app = app;
    this.server = app.listen(config.port, function () {
      console.log(
        'Express server listening on port %d in %s mode',
        config.port,
        app.settings.env,
      );

      // callback to call when the server is ready
      if (readyCallback) {
        readyCallback();
      }
    });
  }
};

exports.close = function () {
  this.server.close();
};
