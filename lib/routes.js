var express = require('express'),
    inflection = require( 'inflection' ),
    _ = require('lodash');

var Routes = function Routes (app, name, options) {

  this.name = options.name || name;
  this.root = options.root || false;
  this.nestedPath = options.nestedPath || false;
  this.base = this._base();

  this.id = options.id || this._defaultId();

  var self = this;

  this.member = options.member || {};
  this.collection = options.collection || {};
  this.routes = [];
};


Routes.defaultActions = {
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
  parent: null,
  _init: function(versionsAndActions) {
    this.versionsAndActions = _.cloneDeep(versionsAndActions);

    //delete this.actions.options;

    var self = this;

     // Create the custom actions.
     this._customActions(this.collection, false);
     this._customActions(this.member, true);

    var routes = {}

    _.each(this.versionsAndActions, function(actions, version) {

      _.each(actions, function(callback, actionName) {
        if (actionName === "options") { return }

        if(!(_.has(Routes.defaultActions, actionName))) return;

        var path = self.path(actionName),
            method, before;

        if(!path) {
          return;
        }

        method = Routes.defaultActions[actionName.toLowerCase()];

        path += '.:format?';

        if(self.before && actionName in self.before) {
          before = [].concat(self.before[actionName]);
        }

        var _callback = {};
        _callback[version] = {controller: callback, before: before}
        var _route = {actionName: actionName, method: method, path: path, callbacks: _callback};

        if ( routes[actionName] === undefined ) {
          routes[actionName] = _route
        } else {
          routes[actionName] = _merge(routes[actionName], _route)
        }
      });
    });
    _.each(routes, function(route, actionName) {
      self._store(route.actionName, route.method, route.path, route.callbacks);
    });
  },
  //Return the name of the controller as default ID
  _defaultId: function() {
    return inflection.singularize(this.name) + '_id';
  },
  _store: function(action, method, path, callbacks) {
    this.routes.push({
      action: action,
      method: method,
      path: path,
      callbacks: callbacks
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

    if(_.has(this,'nestedPath') && this.nestedPath && this.nestedPath.length > 0) {
      base = this.nestedPath + '/' + this.name;
    } else {
      base = '/' + (this.root ? '' : this.name);
    }

    return base;
  },
  //Set configuration to create the nested controller
  _nest: function(callback) {
    var parent = this.parent;
    var prev = parent.nestedPath;
    //Change the base to the show route, so the base will be '/sessions/:session'
    parent.nestedPath = this.path('show');
    parent.subfolder = this.name;

    callback.apply(this);

    parent.subfolder = null;
    parent.nestedPath = prev || null;
  },
  _customActions: function(methods, member) {
    console.log("_customActions");
    console.log(methods);
    if(_.isEmpty(methods))
      return

    var self = this;
    var routes = {};
    _.keys(methods).forEach(function(method) {
        methods[method].forEach(function(action){
          console.log("method: " + method);
          console.log("action: " + action);

          var path = self.base, before, callback;
          _.each(self.versionsAndActions, function(actions, versions) {
            console.log("actions")
            console.log(actions)

            callback = self.actions[action];

            if(self.before && action in self.before) {
              before = [].concat(self.before[action]);
            }

            if(!/\/$/.test(path))
              path += '/';

            if(member) {
              path += ':' + self.id + '/'+ action;
            } else {
              path += action;
            }

            var _callback = {};
            _callback[version] = {controller: callback, before: before}

            var _route = {actionName: actionName, method: method, path: path, callbacks: _callback};

            if ( routes[actionName] === undefined ) {
              routes[actionName] = _route
            } else {
              routes[actionName] = _merge(routes[actionName], _route)
            }
            console.log("custom Action");
            console.log(routes[actionName]);
          })
        });
    });
    _.each(routes, function(route, actionName) {
      self._store(route.actionName, route.method, route.path, route.callbacks);
    });
  }
}

exports.Routes = Routes;
