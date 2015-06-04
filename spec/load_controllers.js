var Rest = require('../lib');

var rest = new Rest( { controllers: __dirname + '/controllers',
                      versioning: { header: 'Accept',
                                    grab :/.*application\/vnd.avi-on.v(\d+)\+json/,
                                    error: '406' }
                    } );

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
    }, function() {
      rest.resources('nested_controller',{
        collection: {
          get: ['collection_action']
        },
        member: {
          post: ['member_action']
        }
      });
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

  //versioned resources
  rest.resources('versioned_resources_controller', {
    versions: ['1','2'],
    collection: {
      get: ['collection_action']
    },
    member: {
      post: ['member_action']
    }
  }, function() {
    rest.resources('versioned_nested_controller',{
      version: ['1','2'],
      collection: {
        get: ['collection_action']
      },
      member: {
        post: ['member_action']
      }
    });
  });

  //versioned resources
  rest.resources('non_versioned_resources_controller', {
    collection: {
      get: ['collection_action']
    },
    member: {
      post: ['member_action']
    }
  }, function() {
    rest.resources('versioned_nested_controller',{
      version: ['1','2'],
      collection: {
        get: ['collection_action']
      },
      member: {
        post: ['member_action']
      }
    });
  });

  //versioned resources
  rest.resources('versioned_resources_controller', {
    versions: ['1','2'],
    collection: {
      get: ['collection_action']
    },
    member: {
      post: ['member_action']
    }
  }, function() {
    rest.resources('non_versioned_nested_controller',{
      collection: {
        get: ['collection_action']
      },
      member: {
        post: ['member_action']
      }
    });
  });

  rest.resources('versioned_change_name_controller', {
    versions: ['1','2'],
    name: 'versioned_custom_name'
  });

  rest.resources('versioned_before_controllers', {
    versions: ['1','2']
  });

  rest.resources('wildcard_resources_controller', {
    versions: ['*']
  });


  rest.mountRoutes(app);
}
