module.exports = {
  options: {
    before: {}
  },
  index: function(req,res) {
    var parentId = req.params.resources_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/nested_controller/index'} );
  },
  create: function(req,res) {
    var parentId = req.params.resources_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/nested_controller/create'} );
  },
  show: function(req,res) {
    var parentId = req.params.resources_controller_id;
    var id = req.params.nested_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/nested_controller/show_' + id} );
  },
  destroy: function(req,res) {
    var parentId = req.params.resources_controller_id;
    var id = req.params.nested_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/nested_controller/destroy_' + id} );
  },
  update: function(req,res) {
    var parentId = req.params.resources_controller_id;
    var id = req.params.nested_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/nested_controller/update_' + id} );
  },
  collection_action: function(req,res) {
    var parentId = req.params.resources_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/nested_controller/collection_action'} );
  },
  member_action: function(req, res) {
    var parentId = req.params.resources_controller_id;
    var id = req.params.nested_controller_id;

    res.json({ msg: 'resources_controller/' + parentId + '/nested_controller/member_action_' + id} );
  }
}