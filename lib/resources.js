import { Routes } from './routes.js';

const Resources = function Resources(app, name, options) {
  Resources.super.call(this, app, name, options);
};

Resources.super = Routes;
Resources.prototype = Object.create(Routes.prototype);

export default Resources;
