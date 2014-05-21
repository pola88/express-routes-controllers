var Rest = require('../lib');

var rest = new Rest( { controllers: __dirname + '/controllers' } );

module.exports = function(server){
  var app = server.app;
  
  //resources
  rest.resources('resources_controller', {
    collection: {
      get: ['collection_action']
    },
    member: {
      post: ['member_action']
    }
  });
  rest.resources('change_name_controller', {
    name: 'custom_name'
  });
  rest.resources('before_controllers');


  //resource
  rest.resource('resource_controller');
  rest.resource('change_name_controller', {
    name: 'resource_custom_name'
  });

  rest.mountRoutes(app);
}