module.exports = {
  options: {
    before: {},
  },
  index(req, res) {
    res.json({ msg: 'resources_controller/index' });
  },
  create(req, res) {
    res.json({ msg: 'resources_controller/create' });
  },
  show(req, res) {
    res.json({
      msg: `resources_controller/show_${req.params.resources_controller_id}`,
    });
  },
  destroy(req, res) {
    res.json({
      msg: `resources_controller/destroy_${req.params.resources_controller_id}`,
    });
  },
  update(req, res) {
    res.json({
      msg: `resources_controller/update_${req.params.resources_controller_id}`,
    });
  },
  collection_action(req, res) {
    res.json({ msg: 'resources_controller/collection_action' });
  },
  member_action(req, res) {
    res.json({
      msg: `resources_controller/member_action_${req.params.resources_controller_id}`,
    });
  },
};
