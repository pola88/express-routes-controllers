var _ = require('lodash'),
    path = require('path'),
    Resources = require('./resources'),
    Resource = require('./resource'),
    fs = require('fs');
;

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

  if (settings.versioning === undefined) { settings.versioning = {} }
  this.vnd_header = settings.versioning.header ? settings.versioning.header.toLowerCase() : 'accept';
  this.vnd_grab = settings.versioning.grab || /vnd.mycompany.com\+json; version=(\d+)(,|$)/;
  this.vnd_error = settings.versioning.error || 406;

  delete settings.versioning;

  if(settings) {
    _.each(settings, function(value, key) {this.settings[key] = value }, this);
  }
}

Rest.prototype = {
  nestedPath: null,
  subfolder: null,
  resource: function(name, options, callback) {
    if('function' == typeof options) {
      callback = options;
      options = {};
    } else if(_.isUndefined(options)) {
      options = {};
    };

    var versions = options.version || options.versions || ['*'];
    if(!Array.isArray(versions) ) { versions = [versions] };

    var controller = this._load(name, versions);

    if(this.subfolder) {
      options.nestedPath = this.nestedPath;
    }

    var resource = new Resource(this, name, options);

    resource._init(controller);

    if('function' == typeof callback) {
      resources.parent = this;
      resource._nest(callback);
    }

    this.addRoutes(resource.routes);

    return this;
  },
  resources: function(name, options, callback) {
    if('function' == typeof options) {
      callback = options;
      options = {};
    } else if(_.isUndefined(options)) {
      options = {};
    };

    var versions = options.version || options.versions || ['*'];
    if(!Array.isArray(versions) ) { versions = [versions] };

    var controller = this._load(name, versions);

    if(this.subfolder) {
      options.nestedPath = this.nestedPath;
    }
    var resources = new Resources(this, name, options);

    resources._init(controller);

    if('function' == typeof callback) {
      resources.parent = this;
      resources._nest(callback);
    }

    this.addRoutes(resources.routes);

    return this;
  },
  mountRoutes: function(app) {
    var that = this;
    this.routes.forEach(function(route) {
      that._createRoute(route, app);
    });
  },
  _load: function(name, versions) {
    var that = this;
    var loaded = {};
    var base_dir = that.settings.controllers;

    _.each(versions, function(version) {
      console.log("Search version: " + version);
      if(version === "*") {
        version_folder = "";
      } else {
        version_folder = "/v" + version;
      }

      var _versions = _.clone(versions);

      while( _versions.length > 0 ) {
        var _version = _versions.pop();
        console.log("Looking in... " + _version);

        var dir = null;
        if(version !== "") {
          dir = base_dir + version_folder;
        } else {
          dir = base_dir;
        }

        if(that.subfolder) {
          dir = path.join(dir, that.subfolder);
        }
        _path = path.join(dir, name) + ".js";


        console.log("search path: " + _path + ". Exist? " + fs.existsSync(_path ) );

        if( fs.existsSync(_path) ) {
          loaded[version] = require(_path);
          console.log(loaded[version]);
          break;
        }
      };
      if (_.isUndefined( loaded[version] ) ) {
        throw new Error("Version " + version + " not find for " + name);
      }
    });

    return loaded;
  },
  invokeCallbacks: function(req, res, chain) {
    console.log("execute");
    var callback = chain.shift();
    var next = arguments.callee;

    console.log("___ callback ____")
    console.log(callback);

    return function() {
      if ( chain.length == 0 ) {
        return callback(req, res);
      } else {
        callback(req, res, next);
      }
    }
  },
  //Create the route on Express
  _createRoute: function(route, app) {
    var that = this;
    //console.log(route);
    app[route.method](route.path, function(req,res,next) {
      var header = that.vnd_header;
      var grab = that.vnd_grab;
      var error = that.vnd_error;


      var header_value = req.headers[header];
      if ( header_value === undefined ) {
        var _before = route.callbacks["*"].before;
        if (_.isArray(_before) ) {
          _before.shift()(req,res, next);
        } else if( _.isFunction(_before) ) {
          _before(req,res, next);
        } else {
          next();
        }
      }
    }, function(req, res) {
      var header = that.vnd_header;
      var grab = that.vnd_grab;
      var error = that.vnd_error;


      var header_value = req.headers[header];
      if ( header_value === undefined ) {
        var _controller = route.callbacks["*"].controller;
        return _controller(req,res);
      }
    });

    return this;
  },
  addRoutes: function(routes) {
    this.routes.push(routes);

    this.routes = _.flatten(this.routes);
  }
}

module.exports = Rest;
