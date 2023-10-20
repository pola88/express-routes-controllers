import Routes from './routes.js';

export default class Resource extends Routes {
  constructor(app, name, options) {
    super(app, name, options);
  }

  // Generate the action's path without id.
  path(action) {
    if (action === 'show') return null;

    let result = this.base;

    switch (action) {
      case 'edit':
      case 'update':
      case 'destroy':
        if (!/\/$/.test(result)) result += '/';
    }

    switch (action) {
      case 'new':
      case 'edit':
        if (!/\/$/.test(result)) result += '/';
        result += action;
    }

    return result;
  }
}
