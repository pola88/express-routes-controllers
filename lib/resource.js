import Routes from './routes.js';
import { addTrailingSlash } from './utils.js';

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
        result = addTrailingSlash(result);
    }

    switch (action) {
      case 'new':
      case 'edit':
        result = addTrailingSlash(result);
        result += action;
    }

    return result;
  }
}
