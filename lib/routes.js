import inflection from 'inflection';
import _ from 'lodash';
import path from 'path';

export default class Routes {
  static defaultActions = {
    index: 'get',
    new: 'get',
    create: 'post',
    show: 'get',
    edit: 'get',
    update: 'put',
    destroy: 'delete',
  };

  /*
  You have to create the function into the controller to generate the default routes, if they aren't in the file,
  the route will not be created.
  */
  constructor(app, name, options) {
    this.name = options.name || name;
    this.root = options.root || false;
    this.nestedPath = options.nestedPath || false;
    this.base = this.getBase();

    this.id = options.id || this.defaultId();

    this.member = options.member || {};
    this.collection = options.collection || {};
    this.routes = [];
    this.parent = null;
  }

  init(versionsAndActions) {
    this.versionsAndActions = _.cloneDeep(versionsAndActions);

    //delete this.actions.options;
    const self = this;

    // Create the custom actions.
    this.customActions(this.collection, false);
    this.customActions(this.member, true);
    let currentPaths = _.flatten(_.values(this.member));
    currentPaths = _.concat(currentPaths, _.flatten(_.values(this.collection)));

    const routes = {};
    _.each(this.versionsAndActions, function (actions, version) {
      if (!actions.options) actions.options = {};

      const before = actions.options.before;
      _.each(actions, function (callback, actionName) {
        if (!_.has(Routes.defaultActions, actionName)) {
          return;
        }
        if (_.includes(currentPaths, actionName)) {
          return;
        }

        let expressPath = self.path(actionName),
          _before;

        if (!expressPath) {
          return;
        }

        const method = Routes.defaultActions[actionName.toLowerCase()];

        expressPath += '.:format?';

        if (before && actionName in before) {
          _before = [].concat(before[actionName]);
        }

        const _callback = {};
        _callback[version] = { controller: callback, before: _before };
        const route = {
          actionName,
          method,
          path: expressPath,
          callbacks: _callback,
        };

        if (routes[actionName] === undefined) {
          routes[actionName] = route;
        } else {
          routes[actionName] = _.merge(routes[actionName], route);
        }
      });
    });
    _.each(routes, function (route, _actionName) {
      self.store(route.actionName, route.method, route.path, route.callbacks);
    });
  }

  //Return the name of the controller as default ID
  defaultId() {
    return `${inflection.singularize(this.name)}_id`;
  }

  store(action, method, expressPath, callbacks) {
    this.routes.push({
      action,
      method,
      path: expressPath,
      callbacks,
    });
  }

  //Generate the action's path
  path(action) {
    let result = this.base;

    switch (action) {
      case 'show':
      case 'edit':
      case 'update':
      case 'destroy':
        if (!/\/$/.test(result)) {
          result += '/';
        }

        result += `:${this.id}`;
    }

    switch (action) {
      case 'new':
      case 'edit':
        if (!/\/$/.test(result)) {
          result += '/';
        }

        result += action;
    }

    return result;
  }

  //If the controller is nested to another controller, We change the base of the url.
  getBase() {
    let base;

    if (
      _.has(this, 'nestedPath') &&
      this.nestedPath &&
      this.nestedPath.length > 0
    ) {
      base = `${this.nestedPath}/${this.name}`;
    } else {
      base = `/${this.root ? '' : this.name}`;
    }

    return base;
  }

  //Set configuration to create the nested controller
  async nest(callback) {
    const parent = this.parent;
    const prev = parent.nestedPath;
    const prevSubfolder = parent.subfolder;

    //Change the base to the show route, so the base will be '/sessions/:session'
    parent.nestedPath = this.path('show');

    if (parent.subfolder) {
      parent.subfolder = path.join(parent.subfolder, this.name);
    } else {
      parent.subfolder = this.name;
    }

    await callback.apply(this);

    parent.subfolder = prevSubfolder || null;
    parent.nestedPath = prev || null;
  }

  customActions(methods, member) {
    if (_.isEmpty(methods)) {
      return;
    }

    const self = this;
    const routes = {};

    _.keys(methods).forEach(function (method) {
      methods[method].forEach(function (actionName) {
        _.each(self.versionsAndActions, function (actions, version) {
          let expressPath = self.base,
            _before;
          const before = actions.options.before;

          const callback = actions[actionName];

          if (before && actionName in before) {
            _before = [].concat(before[actionName]);
          }

          if (!_.has(Routes.defaultActions, actionName)) {
            if (!/\/$/.test(expressPath)) {
              expressPath += '/';
            }

            if (member) {
              expressPath += `:${self.id}/${actionName}`;
            } else {
              expressPath += actionName;
            }
          } else {
            if (member) {
              expressPath += `/:${self.id}`;
            }
          }

          const _callback = {};
          _callback[version] = { controller: callback, before: _before };

          const _route = {
            actionName,
            method,
            path: expressPath,
            callbacks: _callback,
          };

          if (routes[actionName] === undefined) {
            routes[actionName] = _route;
          } else {
            routes[actionName] = _.merge(routes[actionName], _route);
          }
        });
      });
    });
    _.each(routes, function (route, _actionName) {
      self.store(route.actionName, route.method, route.path, route.callbacks);
    });
  }
}
