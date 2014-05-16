module.exports = {
  options: {
    before: {}
  },
  index: function(req,res) {
    res.json({ msg: 'resource_controller/index'} );
  },
  create: function(req,res) {
    res.json({ msg: 'resource_controller/create'} );
  },
  show: function(req,res) {
    res.json( { msg: 'resource_controller/show' } );
  },
  destroy: function(req,res) {
    res.json({ msg: 'resource_controller/destroy'} );
  },
  update: function(req,res) {
    res.json( { msg: 'resource_controller/update' } );
  }
}