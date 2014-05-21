var express = require('express'),
    inflection = require( 'inflection' ),
    _ = require('lodash');

var Routes = function Routes (app, name, options) {
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
      
      
      self._store(actionName, method, path, before, callback);
    });
  },
  //Return the name of the controller as default ID
  _defaultId: function() {
    return inflection.singularize(this.name) + '_id';
  },
  _store: function(action, method, path, before, callback) {
    this.routes.push({
      action: action,
      method: method,
      path: path,
      before: before,
      callback: callback
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
    
    if(_.has(this,'_base') && this._base && this._base.length > 0) {
      base = this._base + '/' + this.name;
    } else {
      base = '/' + (this.root ? '' : this.name);
    }
    
    return base;
  },
  //Set configuration to create the nested controller
  _nest: function(callback) {
    var prev = this._base;
    //Change the base to the show route, so the base will be '/sessions/:session'
    this._base = this.path('show');
    this.subfolder = this.name;

    callback.apply(this);
    
    this.subfolder = null;
    this._base = prev || null;
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

          if(member) {
            path += ':' + self.id + '/'+ action;
          } else {
            path += action;
          }

          self._store(action, method, path, before, callback);
        });
    });
  }
}

exports.Routes = Routes;