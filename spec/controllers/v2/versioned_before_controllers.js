const beforeFunction = function beforeFunction(req, res, next) {
  req.message = 'foo';

  next();
};

module.exports = {
  options: {
    before: {
      index: [beforeFunction],
      create: [beforeFunction],
      show: [beforeFunction],
      update: [beforeFunction],
    },
  },
  index(req, res) {
    res.json({ msg: `v2/versioned_before_controllers/index_${req.message}` });
  },
  create(req, res) {
    res.json({ msg: `v2/versioned_before_controllers/create_${req.message}` });
  },
  show(req, res) {
    res.json({ msg: `v2/versioned_before_controllers/show_${req.message}` });
  },
  destroy(req, res) {
    if (req.message) {
      res.json({
        msg: `v2/versioned_before_controllers/destroy_${req.message}`,
      });
    } else {
      res.json({ msg: 'v2/versioned_before_controllers/destroy' });
    }
  },
  update(req, res) {
    res.json({ msg: `v2/versioned_before_controllers/update_${req.message}` });
  },
};
