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
      //console.log("\nSearch version: " + version + " for " + name );

      //Search in non searched versions plus wild card version
      var _versions = _.clone(versions);
      if ( _versions.indexOf("*") === -1 ) { _versions.unshift("*") }
      _versions = _versions.splice(0, _versions.indexOf(version) + 1);

      //Loop until find a folder
      while( _versions.length > 0 ) {
        var _version = _versions.pop();
        var version_folder = ""
        if(_version !== "*") {
          version_folder = "/v" + _version;
        }

        //console.log("Looking in... " + _version +" in version_folder: " + version_folder);

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

        //console.log("search path: " + _path + ". Exist? " + fs.existsSync(_path ) );

        if( fs.existsSync(_path) ) {
          loaded[version] = require(_path);
          break;
        }
      };
      if (_.isUndefined( loaded[version] ) ) {
        throw new Error("Version " + version + " not find for " + name);
      }
    });

    return loaded;
  },
  fetchVersion: function(req, versions) {
    var header = this.vnd_header;
    var grab = this.vnd_grab;
    var error = this.vnd_error;

    var accept_header = req.headers[header];
    // console.log("accept_header");
    // console.log(accept_header);

    if ( accept_header === undefined ) {
      return this.lastVersion(versions)

    } else {
      var match = grab.exec(accept_header);

      if (match && match[1]) {
        if (match[1] !== "" && versions[match[1] ] ) {
          return match[1];

        } else if (match[1] !== "" && versions[match[1]] === undefined && versions["*"] ) {
          return "*";

        } else if ( match && match[1] ) {
          return this.lastVersion(versions);
        }
      } else {
        throw new Error(accept_header + " is not valid a valid header.")
      }
    }
  },
  //Create the route on Express
  _createRoute: function(route, app) {
    var self = this;
    app[route.method](route.path, function(req,res,next) {
      self.runBefore(route, req, res, next);
    }, function(req, res) {
      self.runController(route, req, res);
    });

    return this;
  },
  lastVersion: function(versions) {
    return _.last( _.keys(versions) );
  },
  runBefore: function(route, req, res, next) {
    var version = this.fetchVersion(req, route.callbacks);

    var _before = route.callbacks[version].before;

    if ( _.isArray(_before) ) {
      _before.shift()(req, res, next);
    } else if( _.isFunction(_before) ) {
      _before(req,res, next);
    } else {
      next();
    }
  },
  runController: function(route, req, res) {
    var version = this.fetchVersion(req, route.callbacks);
    route.callbacks[version].controller(req, res);
  },
  addRoutes: function(routes) {
    this.routes.push(routes);

    this.routes = _.flatten(this.routes);
  }
}

module.exports = Rest;
