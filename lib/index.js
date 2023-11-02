import * as fs from 'fs';
import _ from 'lodash';
import path from 'path';
import Resource from './resource.js';
import Resources from './resources.js';

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
await rest.resources('sessions', {
  collection: {
    get: ['route1']
  },

  member: {
    post: ['route2']
  }
});

CRUD /sessions/:session/users
await rest.resources('sessions', function(){
  await rest.resources('users');
});

You can change the default method for the default actions:

'DELETE /sessions/' instead of 'DELETE /sessions/:session'
rest.resource('sessions', {
  changeDefaultPaths: {
    destroy: 'collection'
  }
});

You define to what versions of API the resource respond to:

await rest.resources('sessions', {
  versions: ['1']
});

If the resource, respond to all versions. You have two options:
await rest.resources('sessions', {
  versions: ['*']
});

Or not include versions options at all.

The versions will be looked into folders corresponding to the version. Example:

await rest.resources('sessions', {
  versions: ['1']
});

It would require <controller's folder>/v1/sessions

If not version is specified or wildcard (['*']), it would be enought with <controller's folder>/sessions


*/

const Rest = function (settings) {
  this.settings = {};
  this.routes = [];

  settings.versioning = settings.versioning || {};
  this.vnd_header = settings.versioning.header
    ? settings.versioning.header.toLowerCase()
    : 'accept';
  //Example: /vnd.mycompany.com\+json; version=(\d+)(,|$)/;
  this.vnd_grab = settings.versioning.grab;
  this.vnd_error = settings.versioning.error || 406;

  delete settings.versioning;

  if (settings) {
    const self = this;
    _.each(settings, function (value, key) {
      self.settings[key] = value;
    });
  }
};

Rest.prototype = {
  nestedPath: null,
  subfolder: null,
  async resource(name, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    } else if (_.isUndefined(options)) {
      options = {};
    }

    let versions = options.version || options.versions || ['*'];
    if (!Array.isArray(versions)) {
      versions = [versions];
    }

    const controller = await this.load(name, versions);

    if (this.subfolder) {
      options.nestedPath = this.nestedPath;
    }

    const resource = new Resource(this, name, options);

    resource.init(controller);

    if (typeof callback === 'function') {
      resource.parent = this;
      await resource.nest(callback);
    }

    this.addRoutes(resource.routes);

    return this;
  },
  async resources(name, options, callback) {
    if (typeof options === 'function') {
      callback = options;
      options = {};
    } else if (_.isUndefined(options)) {
      options = {};
    }

    let versions = options.version || options.versions || ['*'];
    if (!Array.isArray(versions)) {
      versions = [versions];
    }
    const controller = await this.load(name, versions);

    if (this.subfolder) {
      options.nestedPath = this.nestedPath;
    }
    const resources = new Resources(this, name, options);

    resources.init(controller);

    if (typeof callback === 'function') {
      resources.parent = this;
      await resources.nest(callback);
    }

    this.addRoutes(resources.routes);

    return this;
  },
  mountRoutes(app) {
    const that = this;
    this.routes.forEach(function (route) {
      that.createRoute(route, app);
    });
  },
  async load(name, versions) {
    const that = this;
    const loaded = {};
    const base_dir = that.settings.controllers;

    for (const version of versions) {
      //Search in non searched versions plus wild card version
      let clonedVersions = _.clone(versions);
      if (clonedVersions.indexOf('*') === -1) {
        clonedVersions.unshift('*');
      }
      clonedVersions = clonedVersions.splice(
        0,
        clonedVersions.indexOf(version) + 1,
      );

      //Loop until find a folder
      while (clonedVersions.length > 0) {
        const currentVersion = clonedVersions.pop();
        let version_folder = '';

        if (currentVersion !== '*') {
          version_folder = `/v${currentVersion}`;
        }

        let dir = null;
        if (version !== '') {
          dir = base_dir + version_folder;
        } else {
          dir = base_dir;
        }

        if (that.subfolder) {
          dir = path.join(dir, that.subfolder);
        }
        const currentPath = `${path.join(dir, name)}.js`;

        if (fs.existsSync(currentPath)) {
          loaded[version] = await import(currentPath);
          break;
        }
      }

      if (_.isUndefined(loaded[version])) {
        throw new Error(`Version ${version} not find for ${name}`);
      }
    }

    return loaded;
  },
  fetchVersion(req, res, versions) {
    const header = this.vnd_header;
    const grab = this.vnd_grab;
    const accept_header = req.headers[header];

    if (accept_header === undefined || grab === undefined) {
      return this.lastVersion(versions);
    } else {
      const match = grab.exec(accept_header);

      if (match && match[2]) {
        if (match[2] !== '' && versions[match[2]]) {
          return match[2];
        } else if (
          match[2] !== '' &&
          versions[match[2]] === undefined &&
          versions['*']
        ) {
          return '*';
        } else {
          return this.lastVersion(versions);
        }
      } else {
        throw new Error("Header doesn't match RegExp");
      }
    }
  },
  //Create the route on Express
  createRoute(route, app) {
    const self = this;

    app[route.method](
      route.path,
      function (req, res, next) {
        self.runBefore(route, req, res, next);
      },
      function (req, res) {
        self.runController(route, req, res);
      },
    );

    return this;
  },
  lastVersion(versions) {
    return _.last(_.keys(versions));
  },
  runBefore(route, req, res, next) {
    const version = this.fetchVersion(req, res, route.callbacks);

    let _before = route.callbacks[version].before;
    _before = _.clone(_before);

    if (_.isArray(_before) && !_.isEmpty(_before)) {
      this.chainCallbacks(_before, req, res, next);
    } else if (_.isFunction(_before)) {
      _before(req, res, next);
    } else {
      next();
    }
  },
  chainCallbacks(callbacks, req, res, next) {
    const _callback = callbacks.shift();

    if (callbacks.length > 0) {
      _callback(
        req,
        res,
        this.chainCallbacks.bind(this, callbacks, req, res, next),
      );
    } else {
      _callback(req, res, next);
    }
  },
  runController(route, req, res) {
    const version = this.fetchVersion(req, res, route.callbacks);
    const controller = route.callbacks[version].controller;
    const emptyAccept =
      req.headers[this.vnd_header] === undefined || this.vnd_grab === undefined;
    const errorStatus = this.vnd_error;

    // When there is no controller/action for the version requested
    // By default, when no Accept version is set, will have the last version present
    if (!emptyAccept && !controller) {
      return res
        .status(errorStatus)
        .json({ error: 'Unsupported version for this endpoint' });
    }

    // When no Accept header has been and the latest version has no controller/action
    if (emptyAccept && !controller) {
      return res.status(errorStatus).json({ error: 'Accept header missing' });
    }

    controller(req, res);
  },
  addRoutes(routes) {
    this.routes.push(routes);
    this.routes = _.flatten(this.routes);
  },
};

export default Rest;
