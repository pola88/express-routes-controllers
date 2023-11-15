module.exports = {
  options: {
    before: {},
  },
  index(req, res) {
    res.json({ msg: 'resource_controller/index' });
  },
  create(req, res) {
    res.json({ msg: 'resource_controller/create' });
  },
  show(req, res) {
    res.json({ msg: 'resource_controller/show' });
  },
  destroy(req, res) {
    res.json({ msg: 'resource_controller/destroy' });
  },
  update(req, res) {
    res.json({ msg: 'resource_controller/update' });
  },
};
