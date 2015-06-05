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

Optinal headers to version:

var rest = new Rest( { controllers: __dirname + '/app/controllers',
                      versioning: { header: 'Accept',
                                    grab :/.*application\/vnd.mycompany.v(\d+)\+json/,
                                    error: '406' }
                    } );

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

## Resources and Resource:

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

To add support for just some versions:

```
rest.resources('your_controller', {
   versions: ['1']
  }
});

This would require a specific folder structure:
<controller's folder>/v1/your_controller.js


To support all versions, remove the version's option or use a wildcard

```
rest.resources('your_controller', {
   versions: ['*']
  }
});

Or just:

rest.resources('your_controller', {})

In both cases, it would work with default controller's folder:
<controller's folder>/your_controller.js


Possible options:

```
  var options = {
                  versions: ['1','2'],
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


And you also set versions in it and only for the nested:

rest.resources('your_controller', function(){
  rest.resources('another_controller', {versions: ['2']});
});

The required folder structure would be:
<controller's folder>/your_controller.js
<controller's folder>/v2/your_controller/another_controller.js

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
