var express = require('express'),
    _ = require('lodash'),
    inflection = require( 'inflection' ),
    path = require('path');

/*
You have to create the function into the controller to generate the default routes, if they aren't in the file,
the route will not be created.
*/

var defaultlActions = [
  'index',
  'new',
  'create',
  'show',
  'edit',
  'update',
  'destroy'
];

/*
Examples:

CRUD /sessions
GET /sessions/route1
POST /sessions/:session/route2
app.resource('sessions', {
  collection: {
    get: ['route1']
  },
  
  member: {
    post: ['route2']
  }
});

CRUD /sessions/:session/users
app.resource('sessions', function(){
  app.resource('users');
});

You can change the default method for the default actions:

'DELETE /sessions/' instead of 'DELETE /sessions/:session'
app.resource('sessions', {
  changeDefaultPaths: {
    destroy: 'collection'
  }
});

*/



var Resource = module.exports = function Resource(app, name, options) {
  this.app = app;
  this.before = options.before;
  this.name = options.name || name;
  this.root = options.root || false;
  this.base = this._base();
    
  this.id = options.id || this._defaultId();
  
  var self = this;

  this.member = options.member || {};
  this.collection = options.collection || {};
  this.changeDefaultPaths = options.changeDefaultPaths || {};
  this.routes = [];
};

_.merge(Resource.prototype , {
  _init: function(actions) {
    this.actions = actions;
    var self = this;

    defaultlActions.forEach(function(action) {
      if(!(action in self.actions)) return;
      var path = self.path(action),
          callback = self.actions[action],
          method, before;
      
      switch(action) {
        case 'index':
        case 'show':
        case 'new':
        case 'edit':
          method = 'get';
          break;
        case 'create':
          method = 'post';
          break;
        case 'update':
          method = 'put';
          break;
        case 'destroy':
          method = 'delete';
          break;
      }
      
      path += '.:format?';
      
      if(self.before && action in self.before) {
        before = [].concat(self.before[action]);
      }
      
      self._map(method, path, before, callback)
        ._record(action, method, path);
    });

    //Create the custom actions.
    this._customActions(this.collection, false);
    this._customActions(this.member, true);
  },
  //Return the name of the controller as default ID
  _defaultId: function() {
    return inflection.singularize(this.name);
  },
  //Create the route on Express
  _map: function(method, path, middleware, callback) {
    if(Array.isArray(middleware)) {
      this.app[method].apply(this.app, [path].concat(middleware, callback));
    } else {
      this.app[method](path, callback);
    }
    return this;
  },
  _record: function(action, method, path) {
    method = method.toUpperCase();
    this.routes.push({
      action: action,
      method: method,
      path: path
    });
  },
  //Generate the action's path
  path: function(action) {
    var result = this.base;
    var member = true;

    if( _.has(this.changeDefaultPaths, action) )
      member = this.changeDefaultPaths[action] === 'member';

    switch(action) {
      case 'show':
      case 'edit':
      case 'update':
      case 'destroy':
          if(!/\/$/.test(result))
            result += '/';

          if(member)
            result += ':' + this.id;
    }
    
    switch(action) {
      case 'new':
      case 'edit':
        if(!/\/$/.test(result))
          result += '/';
        result += action;
    }
    
    return result;
  },
  //If the controller is nested to another controller, We change the base of the url.
  _base: function() {
    var base;
    
    if(_.has(this.app,'_base') && this.app._base && this.app._base.length > 0) {
      base = this.app._base + '/' + this.name;
    } else {
      base = '/' + (this.root ? '' : this.name);
    }
    
    return base;
  },
  //Set configuration to create the nested controller
  _nest: function(callback) {
    var prev = this.app._base;
    //Change the base to the show route, so the base will be '/sessions/:session'
    this.app._base = this.path('show');
    this.app.subfolder = this.name;

    callback.apply(this);
    
    this.app.subfolder = null;
    this.app._base = prev || null;
  },
  _customActions: function(methods, member) {
    if(_.isEmpty(methods))
      return

    var self = this;

    _.keys(methods).forEach(function(method) {
        methods[method].forEach(function(action){

          var path = self.base, before, callback;
          callback = self.actions[action];

          if(self.before && action in self.before) {
            before = [].concat(self.before[action]);
          }
          
          if(!/\/$/.test(path))
            path += '/';

          if(member)
            path += ':' + self.id + '/'+ action;
          else
            path += action;

          self._map(method, path, before, callback)
              ._record(action, method, path);
        });
    });
  }
});

express.application._load = function(name) {
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
}

/*
  app.resources

  @param {String} controller name
  @param {Object} [options]
  @param {function} nested controller
*/
express.application.resources = function(name, options, callback) {
  if('function' == typeof options)
    callback = options, options = {};

  this.resources = this.resources || {};
  var controller = this._load(name);
  var resource = new Resource(this, name, _.merge(controller.options, options));
  
  resource._init(controller);

  if('function' == typeof callback) {
    resource._nest(callback);
  }
  
  return resource;
}

/*
  //without id
  app.resource

  @param {String} controller name
  @param {Object} [options]
  @param {function} nested controller
*/

express.application.resource = function(name, options, callback) {
  if('function' == typeof options)
    callback = options, options = {};

  this.resources = this.resources || {};
  var controller = this._load(name);
  var resource = new Resource(this, name, _.merge(controller.options, options));
  
  resource._init(controller);

  if('function' == typeof callback) {
    resource._nest(callback);
  }
  
  return resource;
}