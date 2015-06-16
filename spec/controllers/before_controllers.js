var beforeFunction = function beforeFunction(req, res, next) {
  req.message = 'foo';

  next();
};

var beforeFunction2 = function beforeFunction2(req, res, next) {
  req.message += 'bar';

  next();
};

var beforeFunction3 = function beforeFunction3(req, res, next) {
  req.message += 'zoo';

  next();
};

module.exports = {
  options: {
    before: {
      index: [ beforeFunction, beforeFunction2, beforeFunction3 ],
      create: [ beforeFunction ],
      show: [ beforeFunction ],
      update: [ beforeFunction ]
    }
  },
  index: function(req, res) {
    res.json({ msg: 'before_controllers/index_' + req.message } );
  },
  create: function(req, res) {
    res.json({ msg: 'before_controllers/create_' + req.message } );
  },
  show: function(req, res) {
    res.json( { msg: 'before_controllers/show_' + req.message } );
  },
  destroy: function(req, res) {
    if (req.message) {
      res.json({ msg: 'before_controllers/destroy_' + req.message } );
    } else {
      res.json({ msg: 'before_controllers/destroy' } );
    }
  },
  update: function(req, res) {
    res.json( { msg: 'before_controllers/update_' + req.message } );
  }
};
