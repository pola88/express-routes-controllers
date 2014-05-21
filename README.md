express-routes-controllers
==========================

You can create routes for your controllers.

## Install

```
npm install express-routes-controllers
```

## How to use it:

It is very simple:

```
var Rest = require('express-routes-controllers');

var rest = new Rest( { controllers: __dirname + '/app/controllers' } );

```

And then, add the routes:

```
//your_controller.js
module.exports = {
  options: {
    before: {
      action: [/*middleware*/]
    }
  },
  index: function(req, res) {},
  another_action: function(req, res) {}
}

//app.js

var express = require('express');
var app = express();
var Rest = require('express-routes-controllers');
var rest = new Rest( { controllers: __dirname + '/app/controllers' } );

rest.resources('your_controller', options);
rest.resource('another_controller', options);

// ...all routes for your controllers.

//add the routes to express.
rest.mountRoutes(app);

```

## Resoruces and Resoruce:

You can add the CRUD actions:

```
rest.resources('your_controller');

// GET '/your_controller'
// POST '/your_controller'
// PUT '/your_controller/:your_controller_id'
// DELETE '/your_controller/:your_controller_id'
// GET '/your_controller/:your_controller_id'
```

Or if you want to add them without the id on the url (removing the show action):

```
rest.resource('your_controller', options);

// GET '/your_controller'
// POST '/your_controller'
// PUT '/your_controller'
// DELETE '/your_controller'
```

Can also add custom actions with the CRUD actions:

```
rest.resources('your_controller', {
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

Possible options:

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
rest.resources('your_controller', function(){
  rest.resources('another_controller');
});
// '/your_controller/:your_controller_id/another_controller'
```

## Change the url

If you have the user controller and you want that the url be '/account'

```
rest.resources('users', {
  name: 'account'
});

// GET '/account'
// POST '/account'
// PUT '/account/:account_id'
// DELETE '/account/:account_id'
// GET '/account/:account_id'
```
