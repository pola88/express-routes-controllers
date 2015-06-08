module.exports = {
  options: {
    before: {}
  },
  index: function(req,res) {
    res.json({ msg: 'non_versioned_resources_controller/index'} );
  },
  create: function(req,res) {
    res.json({ msg: 'non_versioned_resources_controller/create'} );
  },
  show: function(req,res) {
    res.json( { msg: 'non_versioned_resources_controller/show_' + req.params.non_versioned_resources_controller_id } );
  },
  destroy: function(req,res) {
    res.json({ msg: 'non_versioned_resources_controller/destroy_' + req.params.non_versioned_resources_controller_id } );
  },
  update: function(req,res) {
    res.json( { msg: 'non_versioned_resources_controller/update_' + req.params.non_versioned_resources_controller_id } );
  },
  collection_action: function(req,res) {
    res.json( { msg: 'non_versioned_resources_controller/collection_action' } );
  },
  member_action: function(req, res) {
    res.json( { msg: 'non_versioned_resources_controller/member_action_' + req.params.non_versioned_resources_controller_id } );
  }
}
