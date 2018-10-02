var Rest = require('../lib'),
    path = require('path');

var rest = new Rest( { controllers: path.join(__dirname, '/controllers'),
                      versioning: { header: 'Accept',
                                    grab: /.*application\/vnd.test.v(\d+)\+json/,
                                    error: '405' }
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
    rest.resources('nested_controller', {
      collection: {
        get: ['collection_action']
      },
      member: {
        post: ['member_action']
      }
    }, function() {
      rest.resources('double_nested_controller', {
        collection: {
          get: ['collection_action']
        },
        member: {
          post: ['member_action']
        }
      });
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
    versions: ['1', '2'],
    collection: {
      get: ['collection_action']
    },
    member: {
      post: ['member_action']
    }
  }, function() {
    rest.resources('versioned_nested_controller', {
      version: ['1', '2'],
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
    rest.resources('versioned_nested_controller', {
      version: ['1', '2'],
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
    versions: ['1', '2'],
    collection: {
      get: ['collection_action']
    },
    member: {
      post: ['member_action']
    }
  }, function() {
    rest.resources('non_versioned_nested_controller', {
      collection: {
        get: ['collection_action']
      },
      member: {
        post: ['member_action']
      }
    });
  });

  rest.resources('versioned_change_name_controller', {
    versions: ['1', '2'],
    name: 'versioned_custom_name'
  });

  rest.resources('versioned_before_controllers', {
    versions: ['1', '2']
  });

  rest.resources('wildcard_resources_controller', {
    versions: ['*']
  });

  //versioned resources
  rest.resources('fallback_to_v1_resources_controller', {
    versions: ['1', '2'],
    collection: {
      get: ['collection_action']
    },
    member: {
      post: ['member_action']
    }
  }, function() {
    rest.resources('fallback_to_v1_nested_resources_controller', {
      version: ['1', '2'],
      collection: {
        get: ['collection_action']
      },
      member: {
        post: ['member_action']
      }
    });
  });

  rest.resources('fallback_to_base_resources_controller', {
    versions: ['1', '2']
  });


  rest.mountRoutes(app);
};
