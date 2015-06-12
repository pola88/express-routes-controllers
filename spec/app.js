var express = require('express');

var app = express();
// https://github.com/ferlores/easy-routes/tree/master/testing
// configure Express
app.configure(function() {
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(app.router);
});

exports.start = function( config, readyCallback ) {
  if (!this.server) {
    this.app = app;
    this.server = app.listen( config.port, function () {
      console.log('Express server listening on port %d in %s mode', config.port, app.settings.env);

      // callback to call when the server is ready
      if (readyCallback) {
        readyCallback();
      }
    });
  }
};

exports.close = function() {
  this.server.close();
};
