module.exports = {
  options: {
    before: {}
  },
  index: function(req, res) {
    var parentId = req.params.resources_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/after_double_nested_controller/index'} );
  },
  create: function(req, res) {
    var parentId = req.params.resources_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/after_double_nested_controller/create'} );
  },
  show: function(req, res) {
    var parentId = req.params.resources_controller_id;
    var id = req.params.after_double_nested_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/after_double_nested_controller/show_' + id} );
  },
  destroy: function(req, res) {
    var parentId = req.params.resources_controller_id;
    var id = req.params.after_double_nested_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/after_double_nested_controller/destroy_' + id} );
  },
  update: function(req, res) {
    var parentId = req.params.resources_controller_id;
    var id = req.params.after_double_nested_controller_id;
    res.json({ msg: 'resources_controller/' + parentId + '/after_double_nested_controller/update_' + id} );
  }
};
