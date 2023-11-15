const Routes = require('./routes').Routes;

const Resources = (module.exports = function Resources(app, name, options) {
  Resources.super.call(this, app, name, options);
});

Resources.super = Routes;
Resources.prototype = Object.create(Routes.prototype);
