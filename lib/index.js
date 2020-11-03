var _ = require('lodash'),
  path = require('path'),
  Resources = require('./resources'),
  Resource = require('./resource'),
  fs = require('fs');

/*
  this.resources


*/

/*
Examples:

resources, resource
@param {String} controller name
@param {Object} [options]
  Options:
  {
   versioning: {
    - `header` is the HTTP header name that holds the version number
    - `grab` is a regexp capture group for catching the version number
    - `error` is a HTTP status code that is returned if no re-route is possible
    }
  }

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

You define to what versions of API the resource respond to:

rest.resources('sessions', {
  versions: ['1']
});

If the resource, respond to all versions. You have two options:
rest.resources('sessions', {
  versions: ['*']
});

Or not include versions options at all.

The versions will be looked into folders corresponding to the version. Example:

rest.resources('sessions', {
  versions: ['1']
});

It would require <controller's folder>/v1/sessions

If not version is specified or wildcard (['*']), it would be enought with <controller's folder>/sessions


*/

var Rest = function(settings) {
  this.settings = {};
  this.routes = [];

  settings.versioning = settings.versioning || {};
  this.vnd_header = settings.versioning.header ? settings.versioning.header.toLowerCase() : 'accept';
  //Example: /vnd.mycompany.com\+json; version=(\d+)(,|$)/;
  this.vnd_grab = settings.versioning.grab;
  this.vnd_error = settings.versioning.error || 406;

  delete settings.versioning;

  if(settings) {
    var self = this;
    _.each(settings, function(value, key) {self.settings[key] = value; });
  }
};

Rest.prototype = {
  nestedPath: null,
  subfolder: null,
  resource: function(name, options, callback) {
    if(typeof options === 'function') {
      callback = options;
      options = {};
    } else if(_.isUndefined(options)) {
      options = {};
    }

    var versions = options.version || options.versions || ['*'];
    if(!Array.isArray(versions) ) { versions = [versions]; }

    var controller = this.load(name, versions);

    if(this.subfolder) {
      options.nestedPath = this.nestedPath;
    }

    var resource = new Resource(this, name, options);

    resource.init(controller);

    if(typeof callback === 'function') {
      resource.parent = this;
      resource.nest(callback);
    }

    this.addRoutes(resource.routes);

    return this;
  },
  resources: function(name, options, callback) {
    if(typeof options === 'function') {
      callback = options;
      options = {};
    } else if(_.isUndefined(options)) {
      options = {};
    }

    var versions = options.version || options.versions || ['*'];
    if( !Array.isArray(versions) ) { versions = [versions]; }
    var controller = this.load(name, versions);

    if(this.subfolder) {
      options.nestedPath = this.nestedPath;
    }
    var resources = new Resources(this, name, options);

    resources.init(controller);

    if(typeof callback === 'function') {
      resources.parent = this;
      resources.nest(callback);
    }

    this.addRoutes(resources.routes);

    return this;
  },
  mountRoutes: function(app) {
    var that = this;
    this.routes.forEach(function(route) {
      that.createRoute(route, app);
    });
  },
  load: function(name, versions) {
    var that = this;
    var loaded = {};
    var base_dir = that.settings.controllers;

    _.each(versions, function(version) {
      //Search in non searched versions plus wild card version
      var clonedVersions = _.clone(versions);
      if ( clonedVersions.indexOf('*') === -1 ) { clonedVersions.unshift('*'); }
      clonedVersions = clonedVersions.splice(0, clonedVersions.indexOf(version) + 1);

      //Loop until find a folder
      while( clonedVersions.length > 0 ) {
        var currentVersion = clonedVersions.pop();
        var version_folder = '';

        if(currentVersion !== '*') {
          version_folder = '/v' + currentVersion;
        }

        var dir = null;
        if(version !== '') {
          dir = base_dir + version_folder;
        } else {
          dir = base_dir;
        }

        if(that.subfolder) {
          dir = path.join(dir, that.subfolder);
        }
        var currentPath = path.join(dir, name) + '.js';

        if( fs.existsSync(currentPath) ) {
          loaded[version] = require(currentPath);
          break;
        }
      }

      if (_.isUndefined( loaded[version] ) ) {
        throw new Error('Version ' + version + ' not find for ' + name);
      }
    });

    return loaded;
  },
  fetchVersion: function(req, res, versions) {
    var header = this.vnd_header;
    var grab = this.vnd_grab;
    var accept_header = req.headers[header];

    if ( accept_header === undefined || grab === undefined) {
      return this.lastVersion(versions);

    } else {
      var match = grab.exec(accept_header);

      if (match && match[2]) {
        if (match[2] !== '' && versions[match[2]] ) {
          return match[2];

        } else if (match[2] !== '' && versions[match[2]] === undefined && versions['*'] ) {
          return '*';

        } else {
          return this.lastVersion(versions);
        }
      } else {
        throw new Error('Header doesn\'t match RegExp');
      }
    }
  },
  //Create the route on Express
  createRoute: function(route, app) {
    var self = this;

    app[route.method](route.path, function(req, res, next) {
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
    var version = this.fetchVersion(req, res, route.callbacks);

    var _before = route.callbacks[version].before;
    _before = _.clone(_before);

    if ( _.isArray(_before) && !_.isEmpty(_before) ) {
      this.chainCallbacks(_before, req, res, next);
    } else if( _.isFunction(_before) ) {
      _before(req, res, next);
    } else {
      next();
    }
  },
  chainCallbacks: function(callbacks, req, res, next) {
    var _callback = callbacks.shift();

    if (callbacks.length > 0 ) {
      _callback(req, res, this.chainCallbacks.bind(this, callbacks, req, res, next) );
    } else {
      _callback(req, res, next);
    }

  },
  runController: function(route, req, res) {
    var version = this.fetchVersion(req, res, route.callbacks);
    var controller = route.callbacks[version].controller;
    var emptyAccept = req.headers[this.vnd_header] === undefined || this.vnd_grab === undefined;
    var errorStatus = this.vnd_error;

    // When there is no controller/action for the version requested
    // By default, when no Accept version is set, will have the last version present
    if(!emptyAccept && !controller) {
      return res.status(errorStatus).json({ error: 'Unsupported version for this endpoint' });
    }

    // When no Accept header has been and the latest version has no controller/action
    if(emptyAccept && !controller) {
      return res.status(errorStatus).json({ error: 'Accept header missing' });
    }

    controller(req, res);
  },
  addRoutes: function(routes) {
    this.routes.push(routes);
    this.routes = _.flatten(this.routes);
  }
};

module.exports = Rest;
