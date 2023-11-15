module.exports = {
  options: {
    before: {},
  },
  index(req, res) {
    res.json({ msg: 'v2/versioned_resources_controller/index' });
  },
  create(req, res) {
    res.json({ msg: 'v2/versioned_resources_controller/create' });
  },
  show(req, res) {
    res.json({
      msg: `v2/versioned_resources_controller/show_${req.params.versioned_resources_controller_id}`,
    });
  },
  destroy(req, res) {
    res.json({
      msg: `v2/versioned_resources_controller/destroy_${req.params.versioned_resources_controller_id}`,
    });
  },
  update(req, res) {
    res.json({
      msg: `v2/versioned_resources_controller/update_${req.params.versioned_resources_controller_id}`,
    });
  },
  collection_action(req, res) {
    res.json({ msg: 'v2/versioned_resources_controller/collection_action' });
  },
  member_action(req, res) {
    res.json({
      msg: `v2/versioned_resources_controller/member_action_${req.params.versioned_resources_controller_id}`,
    });
  },
};
