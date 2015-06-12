var express = require('express'),
path = require('path');

var Rest = require('./lib');

var app = express();
// https://github.com/ferlores/easy-routes/tree/master/testing
// configure Express
app.configure(function() {
  app.use(express.logger());
  app.use(express.urlencoded());
  app.use(express.json());
  app.use(express.methodOverride());
  app.use(app.router);
});


var rest = new Rest( { controllers: path.join(__dirname, '/spec/controllers') } );

rest.resources('resources_controller');
rest.mountRoutes(app);


app.listen( 3000, function () {
  console.log('Express server listening on port %d in %s mode', 3000, app.settings.env);


});
