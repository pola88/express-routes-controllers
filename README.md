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
app.resources('your_controller', options);

// GET '/your_controller'
// POST '/your_controller'
// PUT '/your_controller/:your_controller'
// DELETE '/your_controller/:your_controller'
// GET '/your_controller/:your_controller'
```

Or if you want to create CRUD without the id on the url (removing the show action):

```
app.resource('your_controller', options);

// GET '/your_controller'
// POST '/your_controller'
// PUT '/your_controller'
// DELETE '/your_controller'
```

Can also add custom actions instead of the CRUD actions:

```
app.resources('your_controller', {
  collection: {
    get: [ 'collection_action' ]
  },
  member: {
    post: [ 'member_action' ]
  }
}

// GET /your_controller/collection_action
// POST /your_controller/:your_controller/member_action
```

Options:

```
  var options = {
                  collection: {
                    get: [ /* Array of custom actions */ ],
                    post: [ /* Array of custom actions */ ],
                  },
                  member: {
                    get: [ /* Array of custom actions */ ],
                    post: [ /* Array of custom actions */ ],
                  },
                  name: 'Change the default name for the url. DEFAULT: name_of_controller',
                  id: 'The id variable on the ulr. DEFAULT: name_of_controller_id',
                  root: 'Boolean. DEFAULT: false'
                }
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
