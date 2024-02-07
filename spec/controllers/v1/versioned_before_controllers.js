const beforeFunction1 = function beforeFunction(req, res, next) {
  req.message = 'foo';

  next();
};

const beforeFunction2 = function beforeFunction(req, res, next) {
  req.message += 'bar';

  next();
};

export const options = {
  before: {
    index: [beforeFunction1, beforeFunction2],
    create: [beforeFunction1],
    show: [beforeFunction1],
    update: [beforeFunction1],
  },
};
export function index(req, res) {
  res.json({ msg: `v1/versioned_before_controllers/index_${req.message}` });
}
export function create(req, res) {
  res.json({ msg: `v1/versioned_before_controllers/create_${req.message}` });
}
export function show(req, res) {
  res.json({ msg: `v1/versioned_before_controllers/show_${req.message}` });
}
export function destroy(req, res) {
  if (req.message) {
    res.json({
      msg: `v1/versioned_before_controllers/destroy_${req.message}`,
    });
  } else {
    res.json({ msg: 'v1/versioned_before_controllers/destroy' });
  }
}
export function update(req, res) {
  res.json({ msg: `v1/versioned_before_controllers/update_${req.message}` });
}
