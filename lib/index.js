var _ = require('lodash'),
    path = require('path'),
    Resources = require('./resources'),
    Resource = require('./resource');

/*
  this.resources

  
*/

/*
Examples:

resources, resource
@param {String} controller name
@param {Object} [options]
@param {function} nested controller


CRUD /sessions
GET /sessions/route1
POST /sessions/:session/route2
rest.resources('sessions', {
  collection: {
    get: ['route1']
  },
  
  member: {
    post: ['route2']
  }
});

CRUD /sessions/:session/users
rest.resources('sessions', function(){
  app.resources('users');
});

You can change the default method for the default actions:

'DELETE /sessions/' instead of 'DELETE /sessions/:session'
rest.resource('sessions', {
  changeDefaultPaths: {
    destroy: 'collection'
  }
});
*/

var Rest = function(settings) {
  this.settings = {};
  this.routes = [];

  if(settings) {
    _.each(settings, function(value, key) {this.settings[key] = value }, this);
  }
}

Rest.prototype = {
  resource: function(name, options, callback) {
    if('function' == typeof options) {
      callback = options;
      options = {};
    }

    var controller = this._load(name);
    var resource = new Resource(this, name, _.merge(controller.options, options));
    
    resource._init(controller);

    if('function' == typeof callback) {
      resource._nest(callback);
    }

    this.addRoutes(resource.routes);
    
    return this;
  },
  resources: function(name, options, callback) {
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
    
    this.addRoutes(resources.routes);

    return this;
  },
  mountRoutes: function(app) {
    var that = this;
    //map the routes
    this.routes.forEach(function(route) {
      that._createRoute(route, app);
    });
    
  },
  _load: function(name) {
    this._loaded = this._loaded || {};

    if(this.subfolder) {
      nested_name = this.subfolder + name;
    } else {
      nested_name = name;
    }

    if(!(nested_name in this._loaded)) {
      var dir = this.settings.controllers;

      if(this.subfolder) {
        dir = path.join(dir, this.subfolder);
      }

      this._loaded[nested_name] = require(path.join(dir, name));
    }

    return this._loaded[nested_name];
  },
  //Create the route on Express
  _createRoute: function(route, app) {
    if(Array.isArray(route.before)) {
      app[route.method].apply(app, [route.path].concat(route.before, route.callback));
    } else {
      app[route.method](route.path, route.callback);
    }

    return this;
  },
  addRoutes: function(routes) {
    this.routes.push(routes);

    this.routes = _.flatten(this.routes);
  }
}

module.exports = Rest;