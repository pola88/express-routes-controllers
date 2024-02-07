# express-routes-controllers

You can create routes for your controllers.

## Install

```sh
  npm install express-routes-controllers
```

## How Publish

This package does not use Babel so there is no need to build before publishing

```sh
  npm publish
```

## How to use it

It is very simple:

```js
const Rest = require('express-routes-controllers');

const rest = new Rest( { controllers: __dirname + '/app/controllers' } );
```

Optinal headers to version:

```js
const rest = new Rest( {
  controllers: __dirname + '/app/controllers',
  versioning: {
    header: 'Accept',
    grab :/.*application\/vnd.mycompany.v(\d+)\+json/,
    error: '406',
  }
} );
```

And then, add the routes:

```js
// your_controller.js
module.exports = {
  options: {
    before: {
      action: [/*middleware*/]
    }
  },
  index: function(req, res) {},
  another_action: function(req, res) {}
}

// app.js

const express = require('express');
const app = express();
const Rest = require('express-routes-controllers');
const rest = new Rest( { controllers: __dirname + '/app/controllers' } );

await rest.resources('your_controller', options);
await rest.resource('another_controller', options);

// ...all routes for your controllers.

//add the routes to express.
rest.mountRoutes(app);
```

## Resources and Resource

You can add the CRUD actions:

```js
await rest.resources('your_controller');

// GET '/your_controller'
// POST '/your_controller'
// PUT '/your_controller/:your_controller_id'
// DELETE '/your_controller/:your_controller_id'
// GET '/your_controller/:your_controller_id'
```

Or if you want to add them without the id on the url (removing the show action):

```js
await rest.resource('your_controller', options);

// GET '/your_controller'
// POST '/your_controller'
// PUT '/your_controller'
// DELETE '/your_controller'
```

Can also add custom actions with the CRUD actions:

```js
await rest.resources('your_controller', {
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

```js
await rest.resources('your_controller', {
   versions: ['1']
  }
);
```

This would require a specific folder structure:
`<controller's folder>/v1/your_controller.js`

To support all versions, remove the version's option or use a wildcard

```js
await rest.resources('your_controller', {
   versions: ['*']
  }
);
```

Or just:

```js
await rest.resources('your_controller', {})
```

In both cases, it would work with default controller's folder:
`<controller's folder>/your_controller.js`

Possible options:

```js
const options = {
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

```js
await rest.resources('your_controller', async () => { 
  await rest.resources('another_controller');
});
// '/your_controller/:your_controller_id/another_controller'
```

And you also set versions in it and only for the nested:

```js
await rest.resources('your_controller', async () => {
  await rest.resources('another_controller', {versions: ['2']});
});
```

The required folder structure would be:
`<controller's folder>/your_controller.js`
`<controller's folder>/v2/your_controller/another_controller.js`

## Change the url

If you have the user controller and you want that the url be '/account'

```js
await rest.resources('users', {
  name: 'account'
});

// GET '/account'
// POST '/account'
// PUT '/account/:account_id'
// DELETE '/account/:account_id'
// GET '/account/:account_id'
```
