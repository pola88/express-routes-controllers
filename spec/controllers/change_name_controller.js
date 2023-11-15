module.exports = {
  options: {
    before: {},
  },
  index(req, res) {
    res.json({ msg: 'custom_name/index' });
  },
  create(req, res) {
    res.json({ msg: 'custom_name/create' });
  },
  show(req, res) {
    res.json({ msg: 'custom_name/show' });
  },
  destroy(req, res) {
    res.json({ msg: 'custom_name/destroy' });
  },
  update(req, res) {
    res.json({ msg: 'custom_name/update' });
  },
};
