module.exports = {
  options: {
    before: {}
  },
  index: function(req, res) {
    res.json({ msg: 'fallback_to_v1_resources_controller/index'} );
  },
  create: function(req, res) {
    res.json({ msg: 'fallback_to_v1_resources_controller/create'} );
  },
  show: function(req, res) {
    res.json( { msg: 'fallback_to_v1_resources_controller/show_' + req.params.fallback_to_v1_resources_controller_id } );
  },
  destroy: function(req, res) {
    res.json({ msg: 'fallback_to_v1_resources_controller/destroy_' + req.params.fallback_to_v1_resources_controller_id } );
  },
  update: function(req, res) {
    res.json( { msg: 'fallback_to_v1_resources_controller/update_' + req.params.fallback_to_v1_resources_controller_id } );
  },
  collection_action: function(req, res) {
    res.json( { msg: 'fallback_to_v1_resources_controller/collection_action' } );
  },
  member_action: function(req, res) {
    res.json( { msg: 'fallback_to_v1_resources_controller/member_action_' + req.params.fallback_to_v1_resources_controller_id } );
  }
};
