var beforeFunction1 = function beforeFunction(req, res, next) {
  req.message = 'foo';

  next();
}

var beforeFunction2 = function beforeFunction(req, res, next) {
  req.message += 'bar';

  next();
}

module.exports = {
  options: {
    before: {
      index: [ beforeFunction1, beforeFunction2 ],
      create: [ beforeFunction1 ],
      show: [ beforeFunction1 ],
      update: [ beforeFunction1 ]
    }
  },
  index: function(req,res) {
    res.json({ msg: 'v1/versioned_before_controllers/index_' + req.message } );
  },
  create: function(req,res) {
    res.json({ msg: 'v1/versioned_before_controllers/create_' + req.message } );
  },
  show: function(req,res) {
    res.json( { msg: 'v1/versioned_before_controllers/show_' + req.message  } );
  },
  destroy: function(req,res) {
    if (req.message) {
      res.json({ msg: 'v1/versioned_before_controllers/destroy_' + req.message } );
    } else {
      res.json({ msg: 'v1/versioned_before_controllers/destroy' } );
    }
  },
  update: function(req,res) {
    res.json( { msg: 'v1/versioned_before_controllers/update_' + req.message } );
  }
}
