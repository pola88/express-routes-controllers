var express = require('express'),
  inflection = require( 'inflection' ),
  _ = require('lodash'),
  path = require('path');

var Routes = function Routes (app, name, options) {
  this.name = options.name || name;
  this.root = options.root || false;
  this.nestedPath = options.nestedPath || false;
  this.base = this.getBase();

  this.id = options.id || this.defaultId();

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
};
/*
You have to create the function into the controller to generate the default routes, if they aren't in the file,
the route will not be created.
*/

Routes.prototype = {
  parent: null,
  init: function(versionsAndActions) {
    this.versionsAndActions = _.cloneDeep(versionsAndActions);

    //delete this.actions.options;

    var self = this;

    // Create the custom actions.
    this.customActions(this.collection, false);
    this.customActions(this.member, true);
    var currentPaths = _.flatten(_.values(this.member));
    currentPaths = _.concat(currentPaths, _.flatten(_.values(this.collection)));

    var routes = {};
    _.each(this.versionsAndActions, function(actions, version) {
      actions.options = actions.options || {};

      var before = actions.options.before;
      delete actions.options;
      _.each(actions, function(callback, actionName) {
        if(!(_.has(Routes.defaultActions, actionName))) { return; }
        if (_.includes(currentPaths, actionName)) { return; }

        var expressPath = self.path(actionName),
          method,
          _before;

        if(!expressPath) {
          return;
        }

        method = Routes.defaultActions[actionName.toLowerCase()];

        expressPath += '.:format?';

        if(before && actionName in before) {
          _before = [].concat(before[actionName]);
        }

        var _callback = {};
        _callback[version] = {controller: callback, before: _before};
        var route = {
          actionName: actionName,
          method: method,
          path: expressPath,
          callbacks: _callback
        };

        if ( routes[actionName] === undefined ) {
          routes[actionName] = route;
        } else {
          routes[actionName] = _.merge(routes[actionName], route);
        }
      });
    });
    _.each(routes, function(route, actionName) {
      self.store(route.actionName, route.method, route.path, route.callbacks);
    });
  },
  //Return the name of the controller as default ID
  defaultId: function() {
    return inflection.singularize(this.name) + '_id';
  },
  store: function(action, method, expressPath, callbacks) {
    this.routes.push({
      action: action,
      method: method,
      path: expressPath,
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
      if(!/\/$/.test(result)) {
        result += '/';
      }

      result += ':' + this.id;
    }

    switch(action) {
    case 'new':
    case 'edit':
      if( !/\/$/.test(result) ) { result += '/'; }

      result += action;
    }

    return result;
  },
  //If the controller is nested to another controller, We change the base of the url.
  getBase: function() {
    var base;

    if( _.has(this, 'nestedPath') && this.nestedPath && this.nestedPath.length > 0 ) {
      base = this.nestedPath + '/' + this.name;
    } else {
      base = '/' + (this.root ? '' : this.name);
    }

    return base;
  },
  //Set configuration to create the nested controller
  nest: function(callback) {
    var parent = this.parent;
    var prev = parent.nestedPath;
    var prevSubfolder = parent.subfolder;

    //Change the base to the show route, so the base will be '/sessions/:session'
    parent.nestedPath = this.path('show');

    if (parent.subfolder) {
      parent.subfolder = path.join(parent.subfolder, this.name);
    } else {
      parent.subfolder = this.name;
    }

    callback.apply(this);

    parent.subfolder = prevSubfolder || null;
    parent.nestedPath = prev || null;
  },
  customActions: function(methods, member) {
    if( _.isEmpty(methods) ) { return; }

    var self = this;
    var routes = {};

    _.keys(methods).forEach(function(method) {
      methods[method].forEach(function(actionName) {
        _.each(self.versionsAndActions, function(actions, version) {
          var expressPath = self.base, _before, callback;
          var before = actions.options.before;

          callback = actions[actionName];

          if(before && actionName in before) {
            _before = [].concat(before[actionName]);
          }

          if (!_.has(Routes.defaultActions, actionName)) {
            if(!/\/$/.test(expressPath)) { expressPath += '/'; }

            if (member) {
              expressPath += ':' + self.id + '/' + actionName;
            } else {
              expressPath += actionName;
            }
          } else {
            if (member) {
              expressPath += '/:' + self.id;
            }
          }

          var _callback = {};
          _callback[version] = { controller: callback, before: _before };

          var _route = {
            actionName: actionName,
            method: method,
            path: expressPath,
            callbacks: _callback
          };

          if ( routes[actionName] === undefined ) {
            routes[actionName] = _route;
          } else {
            routes[actionName] = _.merge(routes[actionName], _route);
          }
        });
      });
    });
    _.each(routes, function(route, actionName) {
      self.store(route.actionName, route.method, route.path, route.callbacks);
    });
  }
};

exports.Routes = Routes;
