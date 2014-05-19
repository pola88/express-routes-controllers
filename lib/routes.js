var express = require('express'),
    inflection = require( 'inflection' ),
    _ = require('lodash'),
    path = require('path');

var Routes = function Routes (app, name, options) {
  this.app = app;
  this.before = options.before;
  this.name = options.name || name;
  this.root = options.root || false;
  this.base = this._base();
    
  this.id = options.id || this._defaultId();
  
  var self = this;

  this.member = options.member || {};
  this.collection = options.collection || {};
  this.routes = [];
};


Routes.defaultlActions = {  
  'index': 'get',
  'new': 'get',
  'create': 'post',
  'show': 'get',
  'edit': 'get',
  'update': 'put',
  'destroy': 'delete'
}
/*
You have to create the function into the controller to generate the default routes, if they aren't in the file,
the route will not be created.
*/

Routes.prototype = {
  _init: function(actions) {
    this.actions = _.cloneDeep(actions);
    delete this.actions.options;

    var self = this;
    
    //Create the custom actions.
    this._customActions(this.collection, false);
    this._customActions(this.member, true);

    _.each(this.actions, function(callback, actionName) {
      if(!(_.has(Routes.defaultlActions, actionName))) return;

      var path = self.path(actionName),
          method, before;
      
      if(!path) {
        return;
      }

      method = Routes.defaultlActions[actionName.toLowerCase()];
      
      path += '.:format?';
      
      if(self.before && actionName in self.before) {
        before = [].concat(self.before[actionName]);
      }
      
      self._map(method, path, before, callback)
        ._record(actionName, method, path);
    });
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

    switch(action) {
      case 'show':
      case 'edit':
      case 'update':
      case 'destroy':
          if(!/\/$/.test(result))
            result += '/';

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
}

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

exports.Routes = Routes;