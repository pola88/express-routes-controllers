var Resources = require('./resources');
var Resource = require('./resource');

/*
Examples:

CRUD /sessions
GET /sessions/route1
POST /sessions/:session/route2
app.resources('sessions', {
  collection: {
    get: ['route1']
  },
  
  member: {
    post: ['route2']
  }
});

CRUD /sessions/:session/users
app.resources('sessions', function(){
  app.resources('users');
});

You can change the default method for the default actions:

'DELETE /sessions/' instead of 'DELETE /sessions/:session'
app.resource('sessions', {
  changeDefaultPaths: {
    destroy: 'collection'
  }
});

*/