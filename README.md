express-routes-controllers
==========================

You can create routes for your controllers. You only need to include the following:

```
require('express-routes-controllers');
```

And add the dir where you have your controllers:

```
app.set('controllers', __dirname + '/controllers');
```

Create the CRUD actions:

```
app.resources('your_controller');
// '/your_controller'
```

Or if you want to create CRUD without the id on the url (removing the show action):

```
app.resource('your_controller');
```

## Nested controllers

You can set nested controllers, you only have to do:

```
app.resources('your_controller', function(){
  app.resources('another_controller');
});
// '/your_controller/:your_controller_id/another_controller'
```

## Define Controller

Example:

```
module.exports = {
options: {
    before: {
      action: [/*middleware*/]
    }
  },
  index: function(req, res) {},
  another_action: function(req, res) {}
}
```

The id will be the name of the controllers, for example, If the name of the controller is 'user', you can get the id with:

```
req.params.user
```

## Change the url

If you have the user controller and you want that the url be '/account'

```
app.resources('users', {
  name: 'account'
});
```
