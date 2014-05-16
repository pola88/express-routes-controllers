var beforeFunction = function beforeFunction(req, res, next) {
  req.message = 'foo';

  next();
}

module.exports = {
  options: {
    before: { 
      index: [ beforeFunction ],
      create: [ beforeFunction ],
      show: [ beforeFunction ],
      destroy: [ beforeFunction ],
      update: [ beforeFunction ]
    }
  },
  index: function(req,res) {
    res.json({ msg: 'before_controllers/index_' + req.message } );
  },
  create: function(req,res) {
    res.json({ msg: 'before_controllers/create_' + req.message } );
  },
  show: function(req,res) {
    res.json( { msg: 'before_controllers/show_' + req.message  } );
  },
  destroy: function(req,res) {
    res.json({ msg: 'before_controllers/destroy_' + req.message } );
  },
  update: function(req,res) {
    res.json( { msg: 'before_controllers/update_' + req.message } );
  }
}