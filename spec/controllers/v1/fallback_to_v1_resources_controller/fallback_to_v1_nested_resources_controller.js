module.exports = {
  options: {
    before: {}
  },
  index: function(req, res) {
    var parentId = req.params.fallback_to_v1_resources_controller_id;
    res.json({ msg: 'fallback_to_v1_resources_controller/' + parentId + '/fallback_to_v1_nested_controller/index'} );
  },
  create: function(req, res) {
    var parentId = req.params.fallback_to_v1_resources_controller_id;
    res.json({ msg: 'fallback_to_v1_resources_controller/' + parentId + '/fallback_to_v1_nested_controller/create'} );
  },
  show: function(req, res) {
    var parentId = req.params.fallback_to_v1_resources_controller_id;
    var id = req.params.fallback_to_v1_nested_controller_id;
    res.json({ msg: 'fallback_to_v1_resources_controller/' + parentId + '/fallback_to_v1_nested_controller/show_' + id} );
  },
  destroy: function(req, res) {
    var parentId = req.params.fallback_to_v1_resources_controller_id;
    var id = req.params.fallback_to_v1_nested_controller_id;
    res.json({ msg: 'fallback_to_v1_resources_controller/' + parentId + '/fallback_to_v1_nested_controller/destroy_' + id} );
  },
  update: function(req, res) {
    var parentId = req.params.fallback_to_v1_resources_controller_id;
    var id = req.params.fallback_to_v1_nested_controller_id;
    res.json({ msg: 'fallback_to_v1_resources_controller/' + parentId + '/fallback_to_v1_nested_controller/update_' + id} );
  },
  collection_action: function(req, res) {
    var parentId = req.params.fallback_to_v1_resources_controller_id;
    res.json({ msg: 'fallback_to_v1_resources_controller/' + parentId + '/fallback_to_v1_nested_controller/collection_action'} );
  },
  member_action: function(req, res) {
    var parentId = req.params.fallback_to_v1_resources_controller_id;
    var id = req.params.fallback_to_v1_nested_controller_id;

    res.json({ msg: 'fallback_to_v1_resources_controller/' + parentId + '/fallback_to_v1_nested_controller/member_action_' + id} );
  }
};
